/* eslint-disable @typescript-eslint/no-explicit-any */
// src/firebase/services/feedbackService.ts
import { 
    collection, 
    addDoc, 
    doc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    updateDoc, 
    serverTimestamp, 
    orderBy,
    Timestamp
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage } from '../config';
  
  export interface Feedback {
    id?: string;
    consumerId: string;
    consumerName: string;
    manufacturerId: string;
    manufacturerName: string;
    message: string;
    feedbackType: 'suggestion' | 'complaint' | 'praise';
    product?: string;
    status: 'pending' | 'acknowledged' | 'responded';
    createdAt: Timestamp;
    attachments?: {
      id: string;
      name: string;
      type: string;
      url: string;
    }[];
  }
  
  export interface Message {
    id?: string;
    feedbackId: string;
    senderId: string;
    senderName: string;
    senderRole: 'consumer' | 'manufacturer';
    content: string;
    createdAt: Timestamp;
    status: 'sent' | 'delivered' | 'read';
    attachments?: {
      id: string;
      name: string;
      type: string;
      url: string;
    }[];
  }
  
  // Create new feedback
  // src/firebase/services/feedbackService.ts
export async function createFeedback(feedbackData: Omit<Feedback, 'id' | 'createdAt'>, attachmentFiles?: File[]): Promise<string> {
    try {
      let attachments: string | any[] | undefined = [];
      
      // Upload attachments if provided
      if (attachmentFiles && attachmentFiles.length > 0) {
        attachments = await Promise.all(
          attachmentFiles.map(async (file) => {
            const storageRef = ref(storage, `attachments/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            
            return {
              id: Date.now().toString(),
              name: file.name,
              type: file.type,
              url
            };
          })
        );
      }
      
      // Create feedback document with server timestamp - FIX HERE
      const feedbackToSave = {
        ...feedbackData,
        createdAt: serverTimestamp()
      };
      
      // Only add attachments field if there are attachments
      if (attachments.length > 0) {
        feedbackToSave.attachments = attachments;
      }
      
      const docRef = await addDoc(collection(db, 'feedback'), feedbackToSave);
      
      // Also add the first message - FIX HERE TOO
      const messageData: {
        feedbackId: string;
        senderId: string;
        senderName: string;
        senderRole: 'consumer';
        content: string;
        createdAt: any;
        status: 'sent';
        attachments?: any[];
      } = {
        feedbackId: docRef.id,
        senderId: feedbackData.consumerId,
        senderName: feedbackData.consumerName,
        senderRole: 'consumer' as const,
        content: feedbackData.message,
        createdAt: serverTimestamp(),
        status: 'sent' as const
      };
      
      // Only add attachments field if there are attachments
      if (attachments.length > 0) {
        messageData.attachments = attachments;
      }
      
      await addDoc(collection(db, 'messages'), messageData);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw error;
    }
  }
  
  // Get feedback by ID
  export async function getFeedbackById(feedbackId: string): Promise<Feedback | null> {
    try {
      const feedbackDoc = await getDoc(doc(db, 'feedback', feedbackId));
      if (feedbackDoc.exists()) {
        return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
      }
      return null;
    } catch (error) {
      console.error('Error getting feedback:', error);
      throw error;
    }
  }
  
  // Get feedback for consumer
  export async function getConsumerFeedback(consumerId: string): Promise<Feedback[]> {
    try {
      const q = query(
        collection(db, 'feedback'), 
        where('consumerId', '==', consumerId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Feedback));
    } catch (error) {
      console.error('Error getting consumer feedback:', error);
      throw error;
    }
  }
  
  // Get feedback for manufacturer
  export async function getManufacturerFeedback(manufacturerId: string): Promise<Feedback[]> {
    try {
      const q = query(
        collection(db, 'feedback'), 
        where('manufacturerId', '==', manufacturerId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Feedback));
    } catch (error) {
      console.error('Error getting manufacturer feedback:', error);
      throw error;
    }
  }
  
  // Update feedback status
  export async function updateFeedbackStatus(feedbackId: string, status: 'pending' | 'acknowledged' | 'responded'): Promise<void> {
    try {
      await updateDoc(doc(db, 'feedback', feedbackId), { status });
    } catch (error) {
      console.error('Error updating feedback status:', error);
      throw error;
    }
  }
  
  // Add message to feedback
  export async function addMessage(messageData: Omit<Message, 'id' | 'createdAt'>, attachmentFiles?: File[]): Promise<string> {
    try {
      let attachments: { id: string; name: string; type: string; url: string; }[] = [];
      
      // Upload attachments if provided
      if (attachmentFiles && attachmentFiles.length > 0) {
        attachments = await Promise.all(
          attachmentFiles.map(async (file) => {
            const storageRef = ref(storage, `attachments/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            
            return {
              id: Date.now().toString(),
              name: file.name,
              type: file.type,
              url
            };
          })
        );
      }
      
      // Create the message object first without attachments
      const messageToSave = {
        ...messageData,
        createdAt: serverTimestamp()
      };
      
      // Only add attachments if there are any
      if (attachments.length > 0) {
        messageToSave.attachments = attachments;
      }
      
      // Add message document
      const docRef = await addDoc(collection(db, 'messages'), messageToSave);
      
      // If message is from manufacturer, update feedback status to responded
      if (messageData.senderRole === 'manufacturer') {
        await updateFeedbackStatus(messageData.feedbackId, 'responded');
      }
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }
  
  // Get messages for a feedback
  export async function getMessagesByFeedbackId(feedbackId: string): Promise<Message[]> {
    try {
      const q = query(
        collection(db, 'messages'), 
        where('feedbackId', '==', feedbackId),
        orderBy('createdAt', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }
  
  // Update message status
  export async function updateMessageStatus(messageId: string, status: 'sent' | 'delivered' | 'read'): Promise<void> {
    try {
      await updateDoc(doc(db, 'messages', messageId), { status });
    } catch (error) {
      console.error('Error updating message status:', error);
      throw error;
    }
  }