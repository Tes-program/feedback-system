// src/hooks/useFeedback.ts
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Feedback } from '../firebase/services/feedbackService';
import { useAuth } from '../context/AuthContext';

// Hook to get all feedback for current user (consumer or manufacturer)
export function useFeedback() {
  const [feedbackItems, setFeedbackItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, userRole } = useAuth();

  useEffect(() => {
    if (!currentUser || !userRole) {
      setFeedbackItems([]);
      setLoading(false);
      return () => {};
    }

    setLoading(true);
    let q;
    
    if (userRole === 'consumer') {
      q = query(
        collection(db, 'feedback'),
        where('consumerId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'feedback'),
        where('manufacturerId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
    }
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Feedback));
        
        setFeedbackItems(items);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching feedback:', err);
        setError('Failed to load feedback');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, userRole]);

  return { feedbackItems, loading, error };
}

// Hook to get a single feedback by ID
export function useSingleFeedback(feedbackId: string) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!feedbackId) {
      setFeedback(null);
      setLoading(false);
      return () => {};
    }

    setLoading(true);
    
    const unsubscribe = onSnapshot(doc(db, 'feedback', feedbackId), 
      (doc) => {
        if (doc.exists()) {
          setFeedback({ id: doc.id, ...doc.data() } as Feedback);
        } else {
          setFeedback(null);
          setError('Feedback not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching feedback:', err);
        setError('Failed to load feedback');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [feedbackId]);

  return { feedback, loading, error };
}