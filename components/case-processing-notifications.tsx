"use client"

import React, { useState, useEffect } from 'react'
import { useWebSocket } from '@/lib/hooks/useWebSocket'
import { useToast } from '@/components/ui/use-toast'
import { useAppSelector } from '@/lib/hooks'
import { Badge } from '@/components/ui/badge'
import { Bell, CheckCircle, AlertCircle, Clock, CheckCheck } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'

// Define the notification types
interface JobUpdateNotification {
  type: 'job_update'
  job_id: string
  status: string
  message?: string
  progress?: number
  timestamp: string
  additional_data?: Record<string, any>
}

interface CaseProcessingNotification {
  type: 'case_processing'
  case_id: string
  phase: string
  message: string
  timestamp: string
  additional_data?: Record<string, any>
}

type Notification = JobUpdateNotification | CaseProcessingNotification;

// Helper function to get the appropriate icon for a notification phase
const getPhaseIcon = (phase: string) => {
  switch (phase) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'failed':
      return <AlertCircle className="h-5 w-5 text-red-500" />
    default:
      return <Clock className="h-5 w-5 text-blue-500" />
  }
}

// Helper function to get the appropriate color for a notification phase
const getPhaseColor = (phase: string) => {
  switch (phase) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-300'
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'started':
      return 'bg-blue-100 text-blue-800 border-blue-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

// Update the getPhaseIcon and getPhaseColor functions to handle both status and phase
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'failed':
      return <AlertCircle className="h-5 w-5 text-red-500" />
    default:
      return <Clock className="h-5 w-5 text-blue-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-300'
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'started':
      return 'bg-blue-100 text-blue-800 border-blue-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

// Helper function to format timestamp
const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return timestamp;
  }
}

export function CaseProcessingNotifications() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const user = useAppSelector((state) => state.auth.user)
  
  // Only show this component for admins
  if (!user?.is_admin) {
    return null
  }

  // Process a new notification
  const processNotification = (newNotification: Notification) => {
    setNotifications(prevNotifications => {
      const messageId = newNotification.type === 'job_update' 
        ? newNotification.job_id 
        : newNotification.case_id;
      
      // Check if we already have a notification with this ID
      const existingIndex = prevNotifications.findIndex(n => 
        (n.type === 'job_update' && 'job_id' in n && n.job_id === messageId) || 
        (n.type === 'case_processing' && 'case_id' in n && n.case_id === messageId)
      );
      
      if (existingIndex !== -1) {
        // Update the existing notification
        const updatedNotifications = [...prevNotifications];
        updatedNotifications[existingIndex] = newNotification;
        return updatedNotifications;
      } else {
        // Add the new notification
        return [...prevNotifications, newNotification];
      }
    });
    
    // If the notification panel is not open, increment the unread count
    if (!isOpen) {
      setUnreadCount(prev => prev + 1);
    }
  };

  // Connect to the WebSocket
  const { status, messages } = useWebSocket({
    url: `${process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws')}/api/v1/eagle/ws/case-processing?user_id=${user?.id}`,
    onMessage: (message) => {      
      // Process the message based on its type
      if (message.type === 'case_processing') {
        // Handle case processing notifications
        if (message.phase === 'completed' || message.phase === 'failed') {
          toast({
            title: message.phase === 'completed' ? 'Process Completed' : 'Process Failed',
            description: message.message,
            variant: message.phase === 'completed' ? 'default' : 'destructive',
          });
        }
        
        // Process the notification
        processNotification(message as CaseProcessingNotification);
        
      } else if (message.type === 'job_update') {
        // Handle job update notifications
        if (message.status === 'completed' || message.status === 'failed') {
          toast({
            title: message.status === 'completed' ? 'Job Completed' : 'Job Failed',
            description: message.message,
            variant: message.status === 'completed' ? 'default' : 'destructive',
          });
        }
        
        // Process the notification
        processNotification(message as JobUpdateNotification);
      }
    },
  });

  // Mark all as read when opening the panel
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Mark all notifications as read
  const markAllAsRead = () => {
    setUnreadCount(0);
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[1.25rem] h-5"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Case Processing Notifications</SheetTitle>
          <SheetDescription>
            Real-time updates on case processing status
          </SheetDescription>
        </SheetHeader>
        <div className="flex justify-between items-center mt-4 mb-2">
          <div className="text-sm text-muted-foreground">
            WebSocket Status: {status}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="h-3.5 w-3.5 mr-1" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <Bell className="h-10 w-10 mb-2 opacity-20" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {notifications
                .slice()
                .reverse()
                .map((notification, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      notification.type === 'job_update'
                        ? getStatusColor(notification.status)
                        : getPhaseColor(notification.phase)
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {notification.type === 'job_update'
                          ? getStatusIcon(notification.status)
                          : getPhaseIcon(notification.phase)}
                        <span className="font-medium capitalize">
                          {notification.type === 'job_update'
                            ? `Job ${notification.status}`
                            : `Process ${notification.phase}`}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      ID: {notification.type === 'job_update' ? notification.job_id : notification.case_id}
                    </div>
                    <p className="mt-2 text-sm">{notification.message}</p>
                    {notification.type === 'job_update' && notification.progress !== undefined && (
                      <div className="mt-2">
                        <Progress value={notification.progress} className="h-2" />
                        <p className="text-xs text-right mt-1 text-muted-foreground">
                          {notification.progress}%
                        </p>
                      </div>
                    )}
                    {notification.type === 'case_processing' && notification.additional_data &&
                      Object.keys(notification.additional_data).length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <div className="grid grid-cols-2 gap-1">
                            {Object.entries(notification.additional_data).map(
                              ([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium">{key}:</span>{' '}
                                  {typeof value === 'object'
                                    ? JSON.stringify(value)
                                    : String(value)}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    {notification.type === 'job_update' && notification.additional_data &&
                      Object.keys(notification.additional_data).length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <div className="grid grid-cols-2 gap-1">
                            {Object.entries(notification.additional_data).map(
                              ([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium">{key}:</span>{' '}
                                  {typeof value === 'object'
                                    ? JSON.stringify(value)
                                    : String(value)}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
} 