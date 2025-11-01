import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload a photo to Firebase Storage
 * @param uri - Local URI of the photo
 * @param reportId - ID of the report (used for organizing files)
 * @returns Download URL of the uploaded photo
 */
export const uploadPhoto = async (uri: string, reportId: string): Promise<string> => {
  try {
    // Fetch the image from the local URI
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create a unique filename
    const timestamp = Date.now();
    const filename = `${reportId}_${timestamp}.jpg`;

    // Create a reference to the storage location
    const storageRef = ref(storage, `reports/${reportId}/${filename}`);

    // Upload the blob
    await uploadBytes(storageRef, blob);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw new Error('No se pudo subir la foto');
  }
};
