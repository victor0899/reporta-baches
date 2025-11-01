import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  isVerified: boolean; // true if municipality account
  createdAt: Timestamp;
  reportsCreated: string[]; // report IDs
  reportsConfirmed: string[]; // report IDs
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}
