import { useEffect, useState } from "react"
import {
  AlertCircle,
  Bell,
  CheckCheck,
  CheckCircle,
  Clock,
  Cog,
  Trash2,
  User,
} from "lucide-react"

import { useAppSelector } from "@/lib/hooks"
import { useWebSocket } from "@/lib/hooks/useWebSocket"
import { useToast } from "@/components/ui/use-toast"

import { Avatar, AvatarFallback } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Progress } from "./ui/progress"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"

// Define the notification types
interface JobUpdateNotification {
  type: "job_update"
  job_id: string
  status: string
  message?: string
  progress?: number
  timestamp: string
  additional_data?: Record<string, any>
}

interface CaseProcessingNotification {
  type: "case_processing"
  case_id: string
  phase: string
  message: string
  timestamp: string
  additional_data?: Record<string, any>
}

type Notification = JobUpdateNotification | CaseProcessingNotification

// Helper functions
const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "failed":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-blue-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-300"
    case "failed":
      return "bg-red-100 text-red-800 border-red-300"
    case "started":
      return "bg-blue-100 text-blue-800 border-blue-300"
    default:
      return "bg-gray-100 text-gray-800 border-gray-300"
  }
}

const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  } catch (error) {
    console.error("Error formatting timestamp:", error)
    return timestamp
  }
}

function NotificationItem({ notification }: { notification: Notification }) {
  const status =
    notification.type === "job_update"
      ? notification.status
      : notification.phase
  const message = notification.message || "No message"
  const timestamp = formatTimestamp(notification.timestamp)

  return (
    <div
      className={`flex items-start p-3 mb-2 rounded-md border ${getStatusColor(
        status
      )}`}
    >
      <div className="mr-3 mt-0.5">{getStatusIcon(status)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{message}</p>
        <p className="text-xs opacity-70">{timestamp}</p>
        {notification.type === "job_update" &&
          notification.progress !== undefined && (
            <Progress className="h-1.5 mt-2" value={notification.progress} />
          )}
      </div>
    </div>
  )
}

function NotificationsDropdown() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const user = useAppSelector((state) => state.auth.user)

  // Get user identifier - use email instead of id which isn't available in the User type
  const getUserIdentifier = () => {
    return user?.id || ""
  }

  // Process a new notification
  const processNotification = (newNotification: Notification) => {
    setNotifications((prevNotifications) => {
      const messageId =
        newNotification.type === "job_update"
          ? newNotification.job_id
          : newNotification.case_id

      // Check if we already have a notification with this ID
      const existingIndex = prevNotifications.findIndex(
        (n) =>
          (n.type === "job_update" &&
            "job_id" in n &&
            n.job_id === messageId) ||
          (n.type === "case_processing" &&
            "case_id" in n &&
            n.case_id === messageId)
      )

      if (existingIndex !== -1) {
        // Update the existing notification
        const updatedNotifications = [...prevNotifications]
        updatedNotifications[existingIndex] = newNotification
        return updatedNotifications
      } else {
        // Add the new notification
        return [newNotification, ...prevNotifications] // Add to the top
      }
    })

    // If the dropdown is not open, increment the unread count
    if (!isOpen) {
      setUnreadCount((prev) => prev + 1)
    }
  }

  // Connect to the WebSocket
  const { status, messages } = useWebSocket({
    url: `${process.env.NEXT_PUBLIC_API_URL?.replace(
      "http",
      "ws"
    )}/api/v1/eagle/ws/case-processing?user_id=${getUserIdentifier()}`,
    onMessage: (message) => {
      // Process the message based on its type
      if (message.type === "case_processing") {
        // Handle case processing notifications
        if (message.phase === "completed" || message.phase === "failed") {
          toast({
            title:
              message.phase === "completed"
                ? "Process Completed"
                : "Process Failed",
            description: message.message,
            variant: message.phase === "completed" ? "default" : "destructive",
          })
        }

        // Process the notification
        processNotification(message as CaseProcessingNotification)
      } else if (message.type === "job_update") {
        // Handle job update notifications
        if (message.status === "completed" || message.status === "failed") {
          toast({
            title:
              message.status === "completed" ? "Job Completed" : "Job Failed",
            description: message.message,
            variant: message.status === "completed" ? "default" : "destructive",
          })
        }

        // Process the notification
        processNotification(message as JobUpdateNotification)
      }
    },
  })

  // Mark all as read when opening the dropdown
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [isOpen])

  // Mark all as read
  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation()
    setUnreadCount(0)
  }

  // Clear all notifications
  const clearAllNotifications = (e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications([])
    setUnreadCount(0)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9"
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
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[350px]">
        <div className="flex items-center justify-between p-2">
          <div className="text-sm font-medium">Notifications</div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Mark all read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear all
            </Button>
          </div>
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          <div className="p-2">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <NotificationItem key={index} notification={notification} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-center text-muted-foreground p-4">
                <Bell className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
                <p className="text-xs">You're all caught up!</p>
              </div>
            )}
          </div>
        </ScrollArea>
        <DropdownMenuSeparator />
        <div className="p-2">
          <div className="text-xs text-muted-foreground">
            WebSocket Status:{" "}
            <span
              className={
                status === "open" ? "text-green-500" : "text-amber-500"
              }
            >
              {status}
            </span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function TopBar() {
  const user = useAppSelector((state) => state.auth.user)
  
  if (!user) {
    return null
  }

  return (
    <>
      <section className="flex flex-row items-center justify-between w-full p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-row items-center ml-2">
          <div className="font-bold text-xl">EAGLE</div>
        </div>

        <div className="flex flex-row items-center gap-4">
          {user?.is_admin && <NotificationsDropdown />}
          <Separator orientation="vertical" className="h-6" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Cog className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
      <Separator orientation="horizontal" />
    </>
  )
}
