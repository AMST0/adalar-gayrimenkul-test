// Supabase Storage helper functions
import { supabase } from './supabaseClient';

// Dosya türü validasyonu
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const storageHelpers = {
  // Tek dosya yükleme
  async uploadImage(file: File, bucket: string = 'property-images'): Promise<{
    success: boolean;
    url?: string;
    error?: string;
    path?: string;
  }> {
    try {
      // Dosya türü kontrolü
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
          success: false,
          error: 'Sadece resim dosyaları yüklenebilir (JPG, PNG, GIF, WebP)'
        };
      }

      // Dosya boyutu kontrolü
      if (file.size > MAX_FILE_SIZE) {
        return {
          success: false,
          error: 'Dosya boyutu 10MB\'dan büyük olamaz'
        };
      }

      // Benzersiz dosya adı oluştur
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      // Dosyayı Supabase Storage'a yükle
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase storage error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      // Yüklenen dosyanın public URL'ini al
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: urlData.publicUrl,
        path: filePath
      };

    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: 'Dosya yükleme sırasında hata oluştu'
      };
    }
  },

  // Çoklu dosya yükleme
  async uploadMultipleImages(files: File[], bucket: string = 'property-images'): Promise<{
    success: boolean;
    results: Array<{
      success: boolean;
      url?: string;
      error?: string;
      originalName: string;
      path?: string;
    }>;
    successCount: number;
    totalCount: number;
  }> {
    const results = [];
    let successCount = 0;

    for (const file of files) {
      const result = await this.uploadImage(file, bucket);
      results.push({
        ...result,
        originalName: file.name
      });
      
      if (result.success) {
        successCount++;
      }
    }

    return {
      success: successCount > 0,
      results,
      successCount,
      totalCount: files.length
    };
  },

  // Dosya silme
  async deleteImage(filePath: string, bucket: string = 'property-images'): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Delete error:', error);
      return {
        success: false,
        error: 'Dosya silme sırasında hata oluştu'
      };
    }
  },

  // Storage bucket bilgileri
  async getBucketInfo(bucket: string = 'property-images') {
    try {
      const { data, error } = await supabase.storage
        .getBucket(bucket);

      return { data, error };
    } catch (error) {
      console.error('Bucket info error:', error);
      return { data: null, error };
    }
  },

  // Yükleme progress callback ile
  async uploadImageWithProgress(
    file: File, 
    onProgress?: (progress: number) => void,
    bucket: string = 'property-images'
  ): Promise<{
    success: boolean;
    url?: string;
    error?: string;
    path?: string;
  }> {
    try {
      // Dosya validasyonu
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
          success: false,
          error: 'Sadece resim dosyaları yüklenebilir (JPG, PNG, GIF, WebP)'
        };
      }

      if (file.size > MAX_FILE_SIZE) {
        return {
          success: false,
          error: 'Dosya boyutu 10MB\'dan büyük olamaz'
        };
      }

      // Progress simülasyonu başlat
      if (onProgress) {
        onProgress(10);
      }

      // Benzersiz dosya adı
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      if (onProgress) {
        onProgress(50);
      }

      // Dosyayı yükle
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (onProgress) {
        onProgress(80);
      }

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      // Public URL al
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (onProgress) {
        onProgress(100);
      }

      return {
        success: true,
        url: urlData.publicUrl,
        path: filePath
      };

    } catch (error) {
      console.error('Upload with progress error:', error);
      return {
        success: false,
        error: 'Dosya yükleme sırasında hata oluştu'
      };
    }
  }
};

// Storage bucket oluşturma helper'ı (admin işlemi)
export const createStorageBucket = async () => {
  try {
    const { data, error } = await supabase.storage
      .createBucket('property-images', {
        public: true,
        allowedMimeTypes: ALLOWED_IMAGE_TYPES,
        fileSizeLimit: MAX_FILE_SIZE
      });

    return { data, error };
  } catch (error) {
    console.error('Create bucket error:', error);
    return { data: null, error };
  }
};