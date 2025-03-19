// src/hooks/useManufacturers.ts
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { UserProfile } from '../firebase/services/userService';

export function useManufacturers() {
  const [manufacturers, setManufacturers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'users'), where('role', '==', 'manufacturer'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const manufacturersList = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        } as UserProfile));
        
        setManufacturers(manufacturersList);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching manufacturers:', err);
        setError('Failed to load manufacturers');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { manufacturers, loading, error };
}