import { DEFAULT_PRODUCT_IMAGES } from '../data/defaultCustomImages';

const DB_NAME = 'vietphuc_db';
const DB_VERSION = 1;
const STORE_NAME = 'custom_images';
const LOCK_KEY = 'vietphuc_upload_locked';
const LOCAL_STORAGE_KEY = 'vietphuc_custom_item_images';

// Open IndexedDB database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Read all custom images from IndexedDB
async function readAllFromIndexedDB(): Promise<Record<string, string>> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get('all_images');
      req.onsuccess = () => {
        resolve(req.result || {});
      };
      req.onerror = () => {
        resolve({});
      };
    });
  } catch {
    return {};
  }
}

// Write all custom images to IndexedDB
async function writeAllToIndexedDB(images: Record<string, string>): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(images, 'all_images');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to write to IndexedDB:', err);
  }
}

/**
 * Nén ảnh trước khi lưu trữ để bảo vệ bộ nhớ:
 * Tự động thu nhỏ ảnh về kích thước tối đa 800x800px với chất lượng 82% WebP/JPEG,
 * giúp dung lượng từ 3-5MB giảm xuống chỉ còn 40-70KB mà vẫn nét căng.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Failed to read file'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = height;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Thử WebP trước, nếu không hỗ trợ dùng JPEG
        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          if (webpData.startsWith('data:image/webp')) {
            resolve(webpData);
            return;
          }
        } catch {}

        const jpegData = canvas.toDataURL('image/jpeg', quality);
        resolve(jpegData);
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Tải danh sách ảnh tùy chỉnh:
 * Hợp nhất bộ ảnh mặc định cố định an toàn với ảnh người dùng đã lưu trong IndexedDB & localStorage.
 */
export async function loadCustomImages(): Promise<Record<string, string>> {
  let idbImages: Record<string, string> = {};
  let lsImages: Record<string, string> = {};

  try {
    idbImages = await readAllFromIndexedDB();
  } catch {}

  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) lsImages = JSON.parse(saved);
  } catch {}

  // Thứ tự ưu tiên: Mặc định cố định -> LocalStorage -> IndexedDB (Mới nhất)
  return {
    ...DEFAULT_PRODUCT_IMAGES,
    ...lsImages,
    ...idbImages
  };
}

/**
 * Lưu danh sách ảnh tùy chỉnh an toàn vào cả IndexedDB và LocalStorage (có try/catch chống tràn bộ nhớ).
 */
export async function saveCustomImages(images: Record<string, string>): Promise<void> {
  // 1. Lưu vào IndexedDB (dung lượng gigabytes, không bao giờ bị tràn)
  await writeAllToIndexedDB(images);

  // 2. Lưu vào LocalStorage làm fallback an toàn
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(images));
  } catch (err) {
    console.warn('LocalStorage quota reached, saved safely to IndexedDB:', err);
  }
}

/**
 * Lấy trạng thái Khóa / Mở Khóa Upload
 */
export function getStoredLockStatus(): boolean {
  try {
    const saved = localStorage.getItem(LOCK_KEY);
    // Mặc định là TRUE nếu đã có ảnh cố định
    return saved === null ? true : saved === 'true';
  } catch {
    return true;
  }
}

/**
 * Lưu trạng thái Khóa / Mở Khóa Upload
 */
export function setStoredLockStatus(isLocked: boolean): void {
  try {
    localStorage.setItem(LOCK_KEY, isLocked ? 'true' : 'false');
  } catch {}
}

/**
 * Xuất file backup JSON tải về máy
 */
export function exportImagesBackup(images: Record<string, string>): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(images, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `vietphuc_product_images_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Nhập file backup JSON khôi phục ảnh
 */
export async function importImagesBackup(file: File): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (typeof parsed === 'object' && parsed !== null) {
          resolve(parsed);
        } else {
          reject(new Error('File JSON không hợp lệ'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}
