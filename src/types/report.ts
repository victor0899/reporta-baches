import { Timestamp } from 'firebase/firestore';
import { CategoryType } from './category';

export type ReportStatus = 'pending' | 'in_progress' | 'resolved';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface ReportCreator {
  userId: string;
  name: string;
  isAnonymous: boolean;
}

export interface Confirmation {
  userId: string;
  userName: string;
  timestamp: Timestamp;
  photoUrl?: string;
}

export interface ResolutionEvidence {
  photoUrl: string;
  resolvedBy: {
    userId: string;
    userName: string;
  };
  timestamp: Timestamp;
  approvals?: string[]; // user IDs who approved (optional for MVP)
}

export interface Report {
  id: string;
  category: CategoryType;
  location: Location;
  photos: string[]; // Firebase Storage URLs
  description?: string;
  address?: string; // optional reference point
  status: ReportStatus;
  createdBy: ReportCreator;
  confirmations: Confirmation[];
  confirmationCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  resolvedAt?: Timestamp;
  resolutionEvidence?: ResolutionEvidence;
}

// For creating a new report
export interface CreateReportInput {
  category: CategoryType;
  location: Location;
  photo: string; // local URI before upload
  description?: string;
  address?: string;
}
