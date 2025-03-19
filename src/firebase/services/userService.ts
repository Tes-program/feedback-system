// src/firebase/services/userService.ts
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'consumer' | 'manufacturer';
  companyName?: string;
  industry?: string;
  createdAt: string;
}

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', userId), data);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// Get all manufacturers
export async function getManufacturers(): Promise<UserProfile[]> {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'manufacturer'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as UserProfile);
  } catch (error) {
    console.error('Error getting manufacturers:', error);
    throw error;
  }
}