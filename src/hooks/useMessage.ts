// src/hooks/useMessages.ts
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { Message, updateMessageStatus } from '../firebase/services/feedbackService';

export function useMessages(feedbackId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!feedbackId) {
      setMessages([]);
      setLoading(false);
      return () => {};
    }

    setLoading(true);
    const q = query(
      collection(db, 'messages'),
      where('feedbackId', '==', feedbackId),
      orderBy('createdAt', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const messagesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Message));
        
        setMessages(messagesList);
        
        // Mark received messages as read
        messagesList.forEach(message => {
            // Only update messages that are not from the current user and are not already marked as read
            if (message.senderId !== currentUser?.uid && message.status !== 'read' && message.id) {
              updateMessageStatus(message.id, 'read')
                .catch(err => console.error('Error updating message status:', err));
            }
          });
          
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching messages:', err);
          setError('Failed to load messages');
          setLoading(false);
        }
      );
  
      return () => unsubscribe();
    }, [feedbackId, currentUser]);
  
    return { messages, loading, error };
  }