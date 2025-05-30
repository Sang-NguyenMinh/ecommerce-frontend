import { CLOUDINARY_CLOUD_NAME } from '@/libs/env';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
}

export interface CloudinaryError {
  message: string;
  http_code?: number;
}

export const uploadImageToCloudinary = async (
  file: File,
  uploadPreset: string = 'tiptap_image',
): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `Upload failed with status: ${response.status}`,
      );
    }

    const data: CloudinaryUploadResponse = await response.json();

    if (!data.secure_url) {
      throw new Error('Invalid response from Cloudinary');
    }

    return data;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Unknown error occurred during upload');
  }
};

// Utility function to validate image file
export const validateImageFile = (
  file: File,
): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.',
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size too large. Maximum size is 10MB.',
    };
  }

  return { isValid: true };
};

// Generate optimized URL from Cloudinary public_id
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'jpg' | 'png' | 'webp';
    crop?: 'fill' | 'fit' | 'limit' | 'scale';
  } = {},
): string => {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'limit',
  } = options;

  let transformation = `q_${quality},f_${format}`;

  if (width || height) {
    transformation += `,w_${width || 'auto'},h_${height || 'auto'},c_${crop}`;
  }

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${publicId}`;
};
