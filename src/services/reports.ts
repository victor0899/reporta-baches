import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Report, CreateReportInput, CategoryType, Location } from '../types';
import { uploadPhoto } from './storage';

/**
 * Calculate distance between two coordinates in meters (Haversine formula)
 */
const calculateDistance = (loc1: Location, loc2: Location): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (loc1.latitude * Math.PI) / 180;
  const φ2 = (loc2.latitude * Math.PI) / 180;
  const Δφ = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
  const Δλ = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Check for duplicate reports within a certain radius
 * @param location - Location to check
 * @param category - Category of the report
 * @param radiusMeters - Search radius in meters (default 20m)
 * @returns Array of nearby reports
 */
export const checkForDuplicates = async (
  location: Location,
  category: CategoryType,
  radiusMeters: number = 20
): Promise<Report[]> => {
  try {
    // Query reports in the same category
    const reportsRef = collection(db, 'reports');
    const q = query(
      reportsRef,
      where('category', '==', category),
      where('status', '!=', 'resolved')
    );

    const querySnapshot = await getDocs(q);
    const nearbyReports: Report[] = [];

    querySnapshot.forEach((doc) => {
      const report = { id: doc.id, ...doc.data() } as Report;
      const distance = calculateDistance(location, report.location);

      if (distance <= radiusMeters) {
        nearbyReports.push(report);
      }
    });

    return nearbyReports;
  } catch (error) {
    console.error('Error checking duplicates:', error);
    return [];
  }
};

/**
 * Create a new report
 */
export const createReport = async (
  input: CreateReportInput,
  userId: string,
  userName: string,
  isAnonymous: boolean
): Promise<string> => {
  try {
    // Create report document (without photo URL first)
    const reportData = {
      category: input.category,
      location: input.location,
      photos: [], // Will be updated after upload
      description: input.description || '',
      address: input.address || '',
      status: 'pending' as const,
      createdBy: {
        userId,
        name: isAnonymous ? 'Usuario anónimo' : userName,
        isAnonymous,
      },
      confirmations: [],
      confirmationCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'reports'), reportData);

    // Upload photo and update report
    const photoUrl = await uploadPhoto(input.photo, docRef.id);

    await updateDoc(doc(db, 'reports', docRef.id), {
      photos: [photoUrl],
    });

    // Update user's reportsCreated array if not anonymous
    if (!isAnonymous) {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const currentReports = userDoc.data().reportsCreated || [];
        await updateDoc(userRef, {
          reportsCreated: [...currentReports, docRef.id],
        });
      }
    }

    return docRef.id;
  } catch (error) {
    console.error('Error creating report:', error);
    throw new Error('No se pudo crear el reporte');
  }
};

/**
 * Add a confirmation to an existing report
 */
export const confirmReport = async (
  reportId: string,
  userId: string,
  userName: string,
  photoUri?: string
): Promise<void> => {
  try {
    const reportRef = doc(db, 'reports', reportId);
    const reportDoc = await getDoc(reportRef);

    if (!reportDoc.exists()) {
      throw new Error('Reporte no encontrado');
    }

    const report = reportDoc.data() as Report;

    // Upload photo if provided
    let photoUrl: string | undefined;
    if (photoUri) {
      photoUrl = await uploadPhoto(photoUri, reportId);
    }

    // Add confirmation
    const confirmation = {
      userId,
      userName,
      timestamp: Timestamp.now(),
      photoUrl,
    };

    await updateDoc(reportRef, {
      confirmations: [...report.confirmations, confirmation],
      confirmationCount: report.confirmationCount + 1,
      updatedAt: serverTimestamp(),
    });

    // Update user's reportsConfirmed array
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentConfirmed = userDoc.data().reportsConfirmed || [];
      if (!currentConfirmed.includes(reportId)) {
        await updateDoc(userRef, {
          reportsConfirmed: [...currentConfirmed, reportId],
        });
      }
    }
  } catch (error) {
    console.error('Error confirming report:', error);
    throw new Error('No se pudo confirmar el reporte');
  }
};

/**
 * Get all reports
 */
export const getAllReports = async (): Promise<Report[]> => {
  try {
    const reportsRef = collection(db, 'reports');
    const querySnapshot = await getDocs(reportsRef);

    const reports: Report[] = [];
    querySnapshot.forEach((doc) => {
      reports.push({ id: doc.id, ...doc.data() } as Report);
    });

    return reports;
  } catch (error) {
    console.error('Error getting reports:', error);
    return [];
  }
};
