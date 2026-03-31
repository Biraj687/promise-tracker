/**
 * Secure File Upload Utility
 * Handles file validation, sanitization, and secure uploads
 */

// ============================================================================
// FILE UPLOAD CONFIGURATION
// ============================================================================

const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_SIZE: 3 * 1024 * 1024, // 3MB for images
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
  MAX_FILENAME_LENGTH: 100,
};

// ============================================================================
// FILE VALIDATION
// ============================================================================

/**
 * Validates if a file is allowed
 * @param {File} file - The file to validate
 * @param {string} type - 'image' or 'document'
 * @returns {Object} - { valid: boolean, error?: string }
 */
export const validateFile = (file, type = 'image') => {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size
  const maxSize = type === 'image' ? UPLOAD_CONFIG.MAX_IMAGE_SIZE : UPLOAD_CONFIG.MAX_FILE_SIZE;
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit` 
    };
  }

  // Check file type
  const allowedTypes = type === 'image' 
    ? UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES 
    : UPLOAD_CONFIG.ALLOWED_DOCUMENT_TYPES;
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type not allowed. Accepted: ${allowedTypes.join(', ')}` 
    };
  }

  // Check filename length
  if (file.name.length > UPLOAD_CONFIG.MAX_FILENAME_LENGTH) {
    return { 
      valid: false, 
      error: 'Filename is too long' 
    };
  }

  return { valid: true };
};

/**
 * Sanitizes a filename to prevent path traversal attacks
 * @param {string} filename - The original filename
 * @returns {string} - Safe filename
 */
export const sanitizeFilename = (filename) => {
  // Remove path traversal attempts
  let safe = filename.replace(/\.\./g, '_');
  safe = safe.replace(/[\/\\]/g, '_');
  
  // Remove special characters except dots and hyphens
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Ensure filename isn't empty after sanitization
  if (!safe || safe === '.') {
    safe = 'unnamed_file';
  }

  return safe;
};

/**
 * Generates a unique, safe filename
 * @param {File} file - The original file
 * @returns {string} - Safe unique filename
 */
export const generateUniqueFilename = (file) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const ext = file.name.split('.').pop() || 'unknown';
  const baseName = sanitizeFilename(file.name.split('.')[0].substr(0, 50));
  
  return `${baseName}_${timestamp}_${random}.${ext}`;
};

/**
 * Creates FormData with proper file validation
 * @param {File} file - The file to upload
 * @param {string} type - 'image' or 'document'
 * @param {Object} metadata - Additional metadata to include
 * @returns {Object} - { formData: FormData, error?: string }
 */
export const createSecureFormData = (file, type = 'image', metadata = {}) => {
  // Validate file
  const validation = validateFile(file, type);
  if (!validation.valid) {
    return { error: validation.error };
  }

  // Create FormData
  const formData = new FormData();
  
  // Generate safe filename
  const safeFilename = generateUniqueFilename(file);
  
  // Append file with sanitized name
  formData.append('file', file, safeFilename);
  
  // Add metadata with sanitization
  if (typeof metadata === 'object' && metadata !== null) {
    for (const [key, value] of Object.entries(metadata)) {
      if (typeof value === 'string') {
        // Basic sanitization for metadata
        const cleanValue = sanitizeMetadataValue(value);
        formData.append(key, cleanValue);
      }
    }
  }

  return { formData };
};

/**
 * Sanitizes metadata values
 * @param {string} value - The value to sanitize
 * @returns {string} - Sanitized value
 */
const sanitizeMetadataValue = (value) => {
  // Remove null bytes and excessive whitespace
  return value.replace(/\0/g, '').trim().substr(0, 500);
};

// ============================================================================
// IMAGE-SPECIFIC UTILITIES
// ============================================================================

/**
 * Validates image dimensions
 * @param {File} file - The image file
 * @param {Object} constraints - { maxWidth?, maxHeight?, minWidth?, minHeight? }
 * @returns {Promise<Object>} - { valid: boolean, error?: string, width?: number, height?: number }
 */
export const validateImageDimensions = async (file, constraints = {}) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const { maxWidth, maxHeight, minWidth, minHeight } = constraints;
        
        if (maxWidth && img.width > maxWidth) {
          return resolve({ 
            valid: false, 
            error: `Image width exceeds ${maxWidth}px limit`,
            width: img.width,
            height: img.height
          });
        }
        
        if (maxHeight && img.height > maxHeight) {
          return resolve({ 
            valid: false, 
            error: `Image height exceeds ${maxHeight}px limit`,
            width: img.width,
            height: img.height
          });
        }

        if (minWidth && img.width < minWidth) {
          return resolve({ 
            valid: false, 
            error: `Image width is below ${minWidth}px minimum`,
            width: img.width,
            height: img.height
          });
        }

        if (minHeight && img.height < minHeight) {
          return resolve({ 
            valid: false, 
            error: `Image height is below ${minHeight}px minimum`,
            width: img.width,
            height: img.height
          });
        }

        resolve({ 
          valid: true,
          width: img.width,
          height: img.height
        });
      };
      
      img.onerror = () => {
        resolve({ valid: false, error: 'Invalid image file' });
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      resolve({ valid: false, error: 'Failed to read file' });
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Creates a thumbnail preview from an image file
 * @param {File} file - The image file
 * @param {number} maxWidth - Maximum width for thumbnail
 * @param {number} maxHeight - Maximum height for thumbnail
 * @returns {Promise<string>} - Data URL of thumbnail
 */
export const createImageThumbnail = async (file, maxWidth = 200, maxHeight = 200) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * maxHeight / height);
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/webp', 0.8));
      };
      
      img.onerror = () => reject(new Error('Invalid image'));
      img.src = e.target.result;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export default {
  validateFile,
  sanitizeFilename,
  generateUniqueFilename,
  createSecureFormData,
  validateImageDimensions,
  createImageThumbnail,
  UPLOAD_CONFIG
};
