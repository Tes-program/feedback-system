/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/chat/ChatPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PaperAirplaneIcon, 
  PaperClipIcon, 
  ChevronLeftIcon, 
  EllipsisVerticalIcon, 
  CheckIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ArrowDownCircleIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useSingleFeedback } from '../../hooks/useFeedback';
import { useMessages } from '../../hooks/useMessage';
import { addMessage, updateFeedbackStatus } from '../../firebase/services/feedbackService';

const ChatPage = () => {
  const { feedbackId } = useParams<{ feedbackId: string }>();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const { feedback, loading: loadingFeedback } = useSingleFeedback(feedbackId || '');
  const { messages, loading: loadingMessages } = useMessages(feedbackId || '');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [attachments, setAttachments] = useState<File[]>([]);
  
  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (isAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAtBottom]);

  // Handle scroll events to show/hide scroll button
  useEffect(() => {
    const handleScroll = () => {
      const container = messagesContainerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const bottomThreshold = 100; // pixels from bottom
      const isNearBottom = scrollHeight - scrollTop - clientHeight < bottomThreshold;
      
      setIsAtBottom(isNearBottom);
      setShowScrollButton(!isNearBottom);
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsAtBottom(true);
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() && attachments.length === 0) return;
    if (!currentUser || !feedback || !feedbackId) return;
    
    setSending(true);
    
    try {
      // Create message data
      const messageData = {
        feedbackId,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || (userRole === 'consumer' ? 'Consumer' : 'Manufacturer'),
        senderRole: userRole as 'consumer' | 'manufacturer',
        content: newMessage,
        status: 'sent' as const
      };
      
      // Add message
      await addMessage(messageData, attachments);
      
      setNewMessage('');
      setAttachments([]);
      setIsAtBottom(true);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };
  
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...fileArray]);
    }
  };
  
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleAcknowledge = async () => {
    if (!feedbackId) return;
    
    try {
      await updateFeedbackStatus(feedbackId, 'acknowledged');
      setOptionsOpen(false);
    } catch (error) {
      console.error('Error acknowledging feedback:', error);
    }
  };
  
  // Format timestamp to readable time
  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format timestamp to readable date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  // Get status icon for message
  const getStatusIcon = (status: 'sent' | 'delivered' | 'read') => {
    switch (status) {
      case 'sent':
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
      case 'delivered':
        return <CheckIcon className="h-4 w-4 text-gray-400" />;
      case 'read':
        return <CheckCircleIcon className="h-4 w-4 text-primary-500" />;
    }
  };
  
  // Get feedback status badge
  const getFeedbackStatusBadge = (status: 'pending' | 'acknowledged' | 'responded') => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <ClockIcon className="mr-1 h-3 w-3" />
            Pending
          </span>
        );
      case 'acknowledged':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <CheckIcon className="mr-1 h-3 w-3" />
            Acknowledged
          </span>
        );
      case 'responded':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            Responded
          </span>
        );
    }
  };
  
  interface Message {
    id?: string;
    createdAt: any;
    content: string;
    senderRole: 'consumer' | 'manufacturer';
    status: 'sent' | 'delivered' | 'read';
    attachments?: Array<{ id: string; url: string; name: string; }>;
  }
  
  // Group messages by date
    const groupMessagesByDate = () => {
      const groups: { date: string; messages: Message[] }[] = [];
      let currentDate = '';
      let currentGroup: Message[] = [];
      
      messages.forEach((message: Message) => {
      const messageDate = formatDate(message.createdAt);
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });
    
    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }
    
    return groups;
  };

  if (loadingFeedback || loadingMessages || !feedback) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Determine chat partner details
  const chatPartner = {
    id: userRole === 'consumer' ? feedback.manufacturerId : feedback.consumerId,
    name: userRole === 'consumer' ? feedback.manufacturerName : feedback.consumerName,
    type: userRole === 'consumer' ? 'manufacturer' : 'consumer' as 'consumer' | 'manufacturer',
    avatar: userRole === 'consumer' ? feedback.manufacturerName.charAt(0) : feedback.consumerName.charAt(0),
    isOnline: false // You could implement an online status feature if desired
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-10rem)]">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(userRole === 'consumer' ? '/consumer/dashboard' : '/manufacturer/dashboard')}
            className="mr-3 rounded-full p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <div className="flex items-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 font-medium text-lg">
                {chatPartner.avatar}
              </div>
              {chatPartner.isOnline && (
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
              )}
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">{chatPartner.name}</h2>
              <div className="flex items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  {feedback.product && (
                    <span className="mr-2">Re: {feedback.product}</span>
                  )}
                </p>
                <div className="ml-2">
                  {getFeedbackStatusBadge(feedback.status)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setOptionsOpen(!optionsOpen)}
            className="rounded-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <EllipsisVerticalIcon className="h-5 w-5" />
          </button>
          
          {optionsOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              {userRole === 'manufacturer' && feedback.status === 'pending' && (
                <button
                  onClick={handleAcknowledge}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Acknowledge Feedback
                </button>
              )}
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Mark as Important
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Export Conversation
              </button>
              {userRole === 'consumer' && (
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Report Issue
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Chat messages with custom scrollbar */}
      <div 
        ref={messagesContainerRef} 
        className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        {/* Initial feedback message */}
        {feedback && (
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                Feedback Submitted
              </span>
            </div>
            <div className="mb-4 flex justify-start">
              <div className="max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 shadow-sm bg-blue-50 dark:bg-blue-900/20 text-gray-800 dark:text-gray-200 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center mb-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full 
                    ${feedback.feedbackType === 'suggestion' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300' : 
                      feedback.feedbackType === 'complaint' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'}`}
                  >
                    {feedback.feedbackType.charAt(0).toUpperCase() + feedback.feedbackType.slice(1)}
                  </span>
                  {feedback.product && (
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      Product: {feedback.product}
                    </span>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap">{feedback.message}</p>
                <div className="text-xs mt-1 flex justify-end items-center text-gray-500 dark:text-gray-400">
                  {formatTime(feedback.createdAt)}
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-4 rounded-full">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No messages yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start the conversation by sending a message.</p>
          </div>
        ) : (
          groupMessagesByDate().map(group => (
            <div key={group.date} className="mb-6">
              <div className="flex justify-center mb-4">
                <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                  {group.date === formatDate(new Date().toISOString()) ? 'Today' : group.date}
                </span>
              </div>
              
              {group.messages.map(message => (
                <div 
                  key={message.id} 
                  className={`mb-4 flex ${message.senderRole === userRole ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 shadow-sm ${
                      message.senderRole === userRole 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map(attachment => (
                          <div 
                            key={attachment.id} 
                            className={`flex items-center p-2 rounded ${
                              message.senderRole === userRole
                                ? 'bg-primary-700 text-primary-100'
                                : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
                            }`}
                          >
                            <PaperClipIcon className="h-4 w-4 mr-2" />
                            <a 
                              href={attachment.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs truncate hover:underline"
                            >
                              {attachment.name}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className={`text-xs mt-1 flex justify-end items-center ${message.senderRole === userRole ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {formatTime(message.createdAt)}
                      {message.senderRole === userRole && (
                        <span className="ml-2">
                          {getStatusIcon(message.status)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute right-8 bottom-24 bg-primary-600 text-white rounded-full p-2 shadow-lg hover:bg-primary-700 transition-all duration-200 z-10"
          aria-label="Scroll to bottom"
        >
          <ArrowDownCircleIcon className="h-6 w-6" />
        </button>
      )}
      
      {/* Message input */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="mb-3 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center bg-white dark:bg-gray-800 text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                  <PaperClipIcon className="h-3 w-3 mr-1 text-gray-500" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button 
                    onClick={() => removeAttachment(index)} 
                    className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-end">
          <div className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 dark:focus-within:border-primary-500 overflow-hidden">
            <textarea
              rows={1}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="block w-full pt-3 pb-2 px-4 resize-none focus:outline-none dark:bg-gray-700 dark:text-white border-0 focus:ring-0"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              disabled={sending}
            />
            <div className="flex justify-between items-center px-3 py-2 border-t border-gray-200 dark:border-gray-600">
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={handleFileUpload}
                  className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <PaperClipIcon className="h-5 w-5" />
                </button>
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {userRole === 'consumer' 
                  ? 'Your message will remain private' 
                  : `Responding as ${feedback.manufacturerName}`}
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={sending || (!newMessage.trim() && attachments.length === 0)}
            className="ml-3 inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed h-[46px]"
          >
            {sending ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <PaperAirplaneIcon className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;