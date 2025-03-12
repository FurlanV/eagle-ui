import { useState, useEffect, useCallback, useRef } from 'react'

type WebSocketStatus = 'connecting' | 'open' | 'closed' | 'error'

interface WebSocketMessage {
  type: string
  [key: string]: any
}

interface UseWebSocketOptions {
  url: string
  onMessage?: (message: WebSocketMessage) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
  reconnectInterval?: number
  reconnectAttempts?: number
  autoConnect?: boolean
}

export function useWebSocket({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  reconnectInterval = 5000,
  reconnectAttempts = 10,
  autoConnect = true,
}: UseWebSocketOptions) {
  const [status, setStatus] = useState<WebSocketStatus>('closed')
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)

  const connect = useCallback(() => {
    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    // Close existing socket if it exists
    if (socketRef.current) {
      socketRef.current.close()
    }

    try {
      setStatus('connecting')
      const socket = new WebSocket(url)

      socket.onopen = () => {
        setStatus('open')
        reconnectAttemptsRef.current = 0
        if (onOpen) onOpen()
      }

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage
          setMessages((prev) => [...prev, data])
          if (onMessage) onMessage(data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      socket.onclose = () => {
        setStatus('closed')
        if (onClose) onClose()
      }

      socket.onerror = (error) => {
        setStatus('error')
        if (onError) onError(error)
        socket.close()
      }

      socketRef.current = socket
    } catch (error) {
      console.error('Error connecting to WebSocket:', error)
      setStatus('error')
    }
  }, [url])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close()
      socketRef.current = null
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    setStatus('closed')
  }, [])

  const sendMessage = useCallback(
    (message: any) => {
      if (socketRef.current && status === 'open') {
        socketRef.current.send(JSON.stringify(message))
        return true
      }
      return false
    },
    [status]
  )

  // Connect on mount if autoConnect is true
  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    // Cleanup on unmount
    return () => {
      disconnect()
    }
  }, [])

  return {
    status,
    messages,
    connect,
    disconnect,
    sendMessage,
  }
} 