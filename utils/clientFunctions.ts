import { FormState } from './types';

export const renderError = async (error: unknown): Promise<FormState> => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'An error occurred.',
    type: 'error',
  };
};

export function validateAvatar(file: unknown) {
  const maxUploadSize = 1024 * 1024 * 0.5; //0.5MB
  const maxUploadSizeText = '0.5MB';
  const acceptedFileTypes = 'image/';
  if (!file || !(file instanceof File)) {
    throw new Error('Please provide the file.');
  }
  if (!file.type.startsWith(acceptedFileTypes)) {
    throw new Error('File must be an image.');
  }
  if (file.size > maxUploadSize) {
    throw new Error(`File size must be less than ${maxUploadSizeText}.`);
  }
  return file as File;
}
