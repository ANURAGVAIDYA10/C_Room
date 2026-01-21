import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { notificationApi } from "../services/api";
import { stompWebSocketService } from "../services/stompWebSocketService";

interface NotificationContextType {
  notifications: any[];
  unreadCount: number;
  loading: boolean;
  refreshNotifications: () => void;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { sessionReady, currentUser } = useAuth(); // Get sessionReady and currentUser from auth
  
  console.log('NOTIFICATION_LOG: NotificationProvider mounted');

  const fetchNotifications = async () => {
    // Defensive check: only fetch if user is authenticated
    if (!sessionReady || !currentUser) {
      console.log('NOTIFICATION_LOG: Skipping notifications fetch - not authenticated');
      return;
    }
    
    console.log('NOTIFICATION_LOG: Fetching notifications from backend...');
    try {
      const data = await notificationApi.getNotifications();
      setNotifications(data);
      console.log('NOTIFICATION_LOG: Notifications fetched successfully');
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    // Defensive check: only fetch if user is authenticated
    if (!sessionReady || !currentUser) {
      console.log('NOTIFICATION_LOG: Skipping unread count fetch - not authenticated');
      return;
    }
    
    console.log('Fetching unread count from backend...');
    try {
      const data = await notificationApi.getUnreadCount();
      setUnreadCount(data.unreadCount || 0);
      console.log('NOTIFICATION_LOG: Unread count fetched successfully:', data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const refreshNotifications = async () => {
    // Defensive check: only refresh if user is authenticated
    if (!sessionReady || !currentUser) {
      console.log('NOTIFICATION_LOG: Skipping refresh - not authenticated');
      return;
    }
    
    console.log('NOTIFICATION_LOG: Refreshing notifications and unread count');
    await Promise.all([
      fetchNotifications(),
      fetchUnreadCount()
    ]);
    console.log('NOTIFICATION_LOG: Notifications refreshed successfully');
  };

  const markAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      // Update local state to reflect the change
      setNotifications(prev => prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      // Update local state to reflect the change
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const clearAll = async () => {
    try {
      await notificationApi.clearAll();
      // Update local state to reflect the change
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }
  };

  // NEW: Connect WebSocket when session is ready and user is authenticated
  useEffect(() => {
    if (!sessionReady || !currentUser) {
      console.log('NOTIFICATION_LOG: Session not ready or user not authenticated, skipping WebSocket connection');
      return;
    }
    
    console.log('NOTIFICATION_LOG: Session ready and user authenticated, connecting to WebSocket');
    
    // Callback functions for handling notifications from WebSocket
    const handleNotification = (notification: any) => {
      console.log('NOTIFICATION_LOG: Received notification via WebSocket:', notification);
      // Add new notification to the list
      setNotifications(prev => [notification, ...prev]);
      // Increment unread count
      setUnreadCount(prev => prev + 1);
    };
    
    const handleUnreadCount = (count: number) => {
      console.log('NOTIFICATION_LOG: Received unread count via WebSocket:', count);
      setUnreadCount(count);
    };
    
    // Connect to WebSocket
    stompWebSocketService.connect(handleNotification, handleUnreadCount);
    
    // Cleanup function to disconnect when component unmounts or session becomes not ready
    return () => {
      console.log('NOTIFICATION_LOG: Disconnecting WebSocket');
      stompWebSocketService.disconnect();
    };
  }, [sessionReady, currentUser]);

  // NEW: Only refresh when session is ready and user is authenticated
  useEffect(() => {
    if (!sessionReady || !currentUser) {
      console.log('NOTIFICATION_LOG: Session not ready or user not authenticated, skipping notification refresh');
      return;
    }
    
    console.log('NOTIFICATION_LOG: Session ready and user authenticated, refreshing notifications');
    refreshNotifications();
  }, [sessionReady, currentUser]);

  useEffect(() => {
    if (!sessionReady || !currentUser) {
      console.log('NOTIFICATION_LOG: Session not ready or user not authenticated, skipping loading state update');
      return;
    }
    
    setLoading(false);
  }, [sessionReady, currentUser]);

  const value = {
    notifications,
    unreadCount,
    loading,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}