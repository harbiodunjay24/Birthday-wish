import { PhotoSlot, StoryContent } from '../types';
import { INITIAL_PHOTO_SLOTS, INITIAL_STORY_CONTENT } from '../data/defaultContent';

const DB_NAME = 'SkyBlueSurpriseDB';
const DB_VERSION = 1;
const PHOTO_STORE = 'photos';
const CONTENT_STORE = 'content';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(PHOTO_STORE)) {
        db.createObjectStore(PHOTO_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(CONTENT_STORE)) {
        db.createObjectStore(CONTENT_STORE, { keyPath: 'key' });
      }
    };
  });
}

export async function loadPhotosFromDB(): Promise<PhotoSlot[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(PHOTO_STORE, 'readonly');
    const store = tx.objectStore(PHOTO_STORE);
    const request = store.getAll();

    return new Promise((resolve) => {
      request.onsuccess = () => {
        const stored: Array<Partial<PhotoSlot> & { id: string }> = request.result || [];
        if (stored.length === 0) {
          // Check localStorage fallback
          const local = localStorage.getItem('sky_blue_photos');
          if (local) {
            try {
              resolve(JSON.parse(local));
              return;
            } catch {
              // ignore
            }
          }
          resolve(INITIAL_PHOTO_SLOTS);
          return;
        }

        // Merge with initial slots to preserve order & structure
        const merged = INITIAL_PHOTO_SLOTS.map((initSlot) => {
          const found = stored.find((s) => s.id === initSlot.id);
          if (found) {
            return {
              ...initSlot,
              imageUrl: found.imageUrl || initSlot.imageUrl,
              driveId: initSlot.driveId,
              driveUrl: initSlot.driveUrl,
              caption: found.caption || initSlot.caption,
              chapterLabel: found.chapterLabel || initSlot.chapterLabel,
            };
          }
          return initSlot;
        });
        resolve(merged);
      };
      request.onerror = () => resolve(INITIAL_PHOTO_SLOTS);
    });
  } catch (e) {
    console.warn('Falling back to localStorage for photos', e);
    const local = localStorage.getItem('sky_blue_photos');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return INITIAL_PHOTO_SLOTS;
  }
}

export async function savePhotoToDB(slot: PhotoSlot): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    const store = tx.objectStore(PHOTO_STORE);
    store.put(slot);
    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(undefined);
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('IndexedDB save failed, trying localStorage', e);
  }

  // Backup in localStorage without bulky payload if too large
  try {
    const all = await loadPhotosFromDB();
    const updated = all.map((s) => (s.id === slot.id ? slot : s));
    // Check size before saving to localStorage
    const json = JSON.stringify(updated);
    if (json.length < 4 * 1024 * 1024) {
      localStorage.setItem('sky_blue_photos', json);
    }
  } catch {
    // quota exceeded, harmless as IndexedDB is primary
  }
}

export async function deletePhotoFromDB(slotId: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    const store = tx.objectStore(PHOTO_STORE);
    const request = store.get(slotId);

    await new Promise((resolve) => {
      request.onsuccess = () => {
        if (request.result) {
          const updated = { ...request.result, imageUrl: null };
          store.put(updated);
        }
        resolve(undefined);
      };
      request.onerror = () => resolve(undefined);
    });
  } catch (e) {
    console.warn('Error deleting photo in IndexedDB', e);
  }
}

export async function loadStoryContent(): Promise<StoryContent> {
  try {
    const db = await openDB();
    const tx = db.transaction(CONTENT_STORE, 'readonly');
    const store = tx.objectStore(CONTENT_STORE);
    const request = store.get('story');

    return new Promise((resolve) => {
      request.onsuccess = () => {
        if (request.result && request.result.data) {
          resolve({
            ...INITIAL_STORY_CONTENT,
            ...request.result.data,
            letter: {
              ...INITIAL_STORY_CONTENT.letter,
              ...(request.result.data.letter || {}),
            },
            finale: {
              ...INITIAL_STORY_CONTENT.finale,
              ...(request.result.data.finale || {}),
            },
          });
        } else {
          const local = localStorage.getItem('sky_blue_content');
          if (local) {
            try {
              const parsed = JSON.parse(local);
              resolve({
                ...INITIAL_STORY_CONTENT,
                ...parsed,
                letter: {
                  ...INITIAL_STORY_CONTENT.letter,
                  ...(parsed.letter || {}),
                },
                finale: {
                  ...INITIAL_STORY_CONTENT.finale,
                  ...(parsed.finale || {}),
                },
              });
              return;
            } catch {
              // ignore
            }
          }
          resolve(INITIAL_STORY_CONTENT);
        }
      };
      request.onerror = () => resolve(INITIAL_STORY_CONTENT);
    });
  } catch {
    const local = localStorage.getItem('sky_blue_content');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return INITIAL_STORY_CONTENT;
  }
}

export async function saveStoryContentToDB(content: StoryContent): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(CONTENT_STORE, 'readwrite');
    const store = tx.objectStore(CONTENT_STORE);
    store.put({ key: 'story', data: content });
  } catch (e) {
    console.warn('IndexedDB content save error', e);
  }
  try {
    localStorage.setItem('sky_blue_content', JSON.stringify(content));
  } catch {
    // ignore
  }
}

export async function resetAllToDefault(): Promise<void> {
  try {
    const db = await openDB();
    const tx1 = db.transaction(PHOTO_STORE, 'readwrite');
    tx1.objectStore(PHOTO_STORE).clear();
    const tx2 = db.transaction(CONTENT_STORE, 'readwrite');
    tx2.objectStore(CONTENT_STORE).clear();
  } catch {
    // ignore
  }
  localStorage.removeItem('sky_blue_photos');
  localStorage.removeItem('sky_blue_content');
}
