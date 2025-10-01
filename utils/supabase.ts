import { createClient } from '@supabase/supabase-js';

const bucket = 'product';

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export const uploadImage = async (image: File | Buffer, name?: string) => {
  const timestamp = Date.now();
  const fileName = image instanceof File ? image.name : name;
  const newName = `${timestamp}-${fileName}`;
  const { data } = await supabase.storage
    .from(bucket)
    .upload(newName, image, { cacheControl: '3600' });
  if (!data) throw new Error('Image upload failed');
  return supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
};

export const deleteImage = async (url: string) => {
  const imageName = url.split('/').pop();
  if (!imageName) throw new Error('Invalid url');
  return supabase.storage.from(bucket).remove([imageName]);
};

export const clearAllImages = async () => {
  return supabase.storage.emptyBucket(bucket);
};
