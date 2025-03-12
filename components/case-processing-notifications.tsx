"use client"

import React, { useState, useEffect } from 'react'
import { useWebSocket } from '@/lib/hooks/useWebSocket'
import { useToast } from '@/components/ui/use-toast'
import { useAppSelector } from '@/lib/hooks'
import { Badge } from '@/components/ui/badge'
import { Bell, X, CheckCircle, AlertCircle, Clock } from 'lucide-react'
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
import { formatDistanceToNow } from 'date-fns'

// Define the notification types
interface CaseProcessingNotification {
  type: 'case_processing'
  case_id: string
  phase: string
  message: string
  timestamp: string
  additional_data?: Record<string, any>
}

type Notification = CaseProcessingNotification

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

  // Connect to the WebSocket
  const { status, messages, connect } = useWebSocket({
    url: `${process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws') || 'ws://localhost:8000'}/api/v1/eagle/ws/case-processing?user_id=${user?.id}`,
    onMessage: (message) => {
      if (
        message.type === 'case_processing' &&
        (message.phase === 'completed' || message.phase === 'failed')
      ) {
        toast({
          title: message.phase === 'completed' ? 'Process Completed' : 'Process Failed',
          description: message.message,
          variant: message.phase === 'completed' ? 'default' : 'destructive',
        })
      }
    },
  })

  // Update notifications when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setNotifications(messages as Notification[])
      
      // If the notification panel is not open, increment the unread count
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1)
      }
    }
  }, [messages, isOpen])

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
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotifications([])}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
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
                    className={`p-4 rounded-lg border ${getPhaseColor(
                      notification.phase
                    )}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getPhaseIcon(notification.phase)}
                        <span className="font-medium capitalize">
                          {notification.phase}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp}
                        {/* {formatDistanceToNow(new Date(notification.timestamp), {
                          addSuffix: true,
                        })} */}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">{notification.message}</p>
                    {notification.additional_data &&
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