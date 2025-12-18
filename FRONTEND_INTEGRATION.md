# Frontend Integration Guide - Chaos AI Backend

This guide will help you integrate the Chaos AI backend into your mobile application. The backend provides real-time AI chat functionality via WebSocket and also offers a REST API endpoint.

## 📋 Table of Contents

- [Overview](#overview)
- [Base URL Configuration](#base-url-configuration)
- [WebSocket Integration](#websocket-integration)
- [REST API Integration](#rest-api-integration)
- [Event Reference](#event-reference)
- [Error Handling](#error-handling)
- [Connection States](#connection-states)
- [Example Implementations](#example-implementations)

## 🌐 Overview

The Chaos AI backend provides two ways to interact with the AI:

1. **WebSocket Gateway** (Recommended for real-time chat) - `/` (default Socket.IO path)
2. **REST API** (Alternative for simple requests) - `POST /ai/chat`

The WebSocket gateway is recommended for chat functionality as it provides real-time bidirectional communication.

## 🔌 Base URL Configuration

**Backend URL**: Get the backend URL from your backend developer. It should be in the format:
- Development: `http://192.168.x.x:3000` (local network IP)
- Production: `https://your-domain.com` (production domain)

**Important**: For mobile apps, make sure your device can reach the backend URL. In development, ensure both devices are on the same network.

## ⚡ WebSocket Integration

### Connection

Connect to the WebSocket server using Socket.IO:

```javascript
// JavaScript/TypeScript example
import io from 'socket.io-client';

const socket = io('http://192.168.1.18:3000', {
  transports: ['websocket'], // Use websocket transport for mobile
  reconnection: true, // Auto-reconnect on disconnect
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
```

### Events

#### Client → Server Events

##### `message`
Send a message to the AI.

**Payload:**
```json
{
  "message": "What time is it?"
}
```

**Example:**
```javascript
socket.emit('message', { 
  message: 'What time is it?' 
});
```

#### Server → Client Events

##### `connect`
Emitted when the client successfully connects to the server.

**Example:**
```javascript
socket.on('connect', () => {
  console.log('Connected to Chaos AI');
  // You can now send messages
});
```

##### `disconnect`
Emitted when the client disconnects from the server.

**Example:**
```javascript
socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});
```

##### `ai-response`
Emitted when the AI responds to your message.

**Payload:**
```json
{
  "response": "Time is just a social construct invented by soup enthusiasts..."
}
```

**Example:**
```javascript
socket.on('ai-response', (data) => {
  console.log('AI Response:', data.response);
  // Update your UI with the response
  displayMessage(data.response);
});
```

##### `error`
Emitted when an error occurs.

**Payload:**
```json
{
  "message": "Failed to process message"
}
```

**Example:**
```javascript
socket.on('error', (error) => {
  console.error('Error:', error.message);
  // Show error to user
  showError(error.message);
});
```

## 🔗 REST API Integration

As an alternative to WebSocket, you can use the REST API:

### Endpoint

**POST** `/ai/chat`

### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "message": "What time is it?"
}
```

### Response

**Success (200 OK):**
```json
{
  "response": "Time is just a social construct invented by soup enthusiasts..."
}
```

**Error (500 Internal Server Error):**
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

### Example (JavaScript/TypeScript)

```javascript
async function sendMessage(message) {
  try {
    const response = await fetch('http://192.168.1.18:3000/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get response');
    }
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

## 📚 Event Reference

### Client Events (What you send)

| Event | Payload | Description |
|-------|---------|-------------|
| `message` | `{ message: string }` | Send a message to the AI |

### Server Events (What you receive)

| Event | Payload | Description |
|-------|---------|-------------|
| `connect` | - | Connection established |
| `disconnect` | `reason: string` | Connection lost |
| `ai-response` | `{ response: string }` | AI's response to your message |
| `error` | `{ message: string }` | Error occurred |

## ⚠️ Error Handling

Always handle errors and connection states:

```javascript
// Handle connection errors
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  // Show user that connection failed
  showConnectionError();
});

// Handle errors from the server
socket.on('error', (error) => {
  console.error('Server error:', error.message);
  // Show error message to user
  showError(error.message);
});

// Handle disconnection
socket.on('disconnect', (reason) => {
  if (reason === 'io server disconnect') {
    // Server disconnected, reconnect manually
    socket.connect();
  }
  // Show disconnected state to user
  showDisconnectedState();
});
```

## 🔄 Connection States

Monitor connection state for better UX:

```javascript
socket.on('connect', () => {
  console.log('Connected');
  updateConnectionStatus('connected');
});

socket.on('disconnect', () => {
  console.log('Disconnected');
  updateConnectionStatus('disconnected');
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after', attemptNumber, 'attempts');
  updateConnectionStatus('connected');
});

socket.on('reconnect_attempt', () => {
  console.log('Attempting to reconnect...');
  updateConnectionStatus('reconnecting');
});

socket.on('reconnect_failed', () => {
  console.error('Reconnection failed');
  updateConnectionStatus('failed');
});
```

## 💻 Example Implementations

### React Native / JavaScript

```javascript
import io from 'socket.io-client';

class ChatService {
  constructor(baseURL) {
    this.socket = null;
    this.baseURL = baseURL;
    this.listeners = [];
  }

  connect() {
    this.socket = io(this.baseURL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to Chaos AI');
      this.onConnect();
    });

    this.socket.on('ai-response', (data) => {
      this.onMessage(data.response);
    });

    this.socket.on('error', (error) => {
      this.onError(error.message);
    });

    this.socket.on('disconnect', () => {
      this.onDisconnect();
    });
  }

  sendMessage(message) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('message', { message });
    } else {
      console.error('Socket not connected');
      this.onError('Not connected to server');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onConnect() {
    // Override in your component
  }

  onMessage(response) {
    // Override in your component
  }

  onError(error) {
    // Override in your component
  }

  onDisconnect() {
    // Override in your component
  }
}

// Usage in component
const chatService = new ChatService('http://192.168.1.18:3000');

chatService.onMessage = (response) => {
  // Update UI with AI response
  setMessages(prev => [...prev, { text: response, isAI: true }]);
};

chatService.onError = (error) => {
  // Show error to user
  Alert.alert('Error', error);
};

// Connect when component mounts
chatService.connect();

// Send message
chatService.sendMessage('Hello AI!');
```

### Swift (iOS) - Using Socket.IO-Client-Swift

```swift
import SocketIO

class ChatService {
    private var manager: SocketManager!
    private var socket: SocketIOClient!
    private let baseURL: String
    
    init(baseURL: String) {
        self.baseURL = baseURL
        self.manager = SocketManager(
            socketURL: URL(string: baseURL)!,
            config: [.log(false), .compress, .reconnects(true), .reconnectAttempts(5)]
        )
        self.socket = manager.defaultSocket
        setupHandlers()
    }
    
    func connect() {
        socket.connect()
    }
    
    func disconnect() {
        socket.disconnect()
    }
    
    func sendMessage(_ message: String) {
        socket.emit("message", with: [["message": message]])
    }
    
    private func setupHandlers() {
        socket.on(clientEvent: .connect) { data, ack in
            print("Connected to Chaos AI")
            // Handle connection
        }
        
        socket.on("ai-response") { data, ack in
            if let response = data[0] as? [String: Any],
               let message = response["response"] as? String {
                // Handle AI response
                self.handleAIResponse(message)
            }
        }
        
        socket.on("error") { data, ack in
            if let error = data[0] as? [String: Any],
               let message = error["message"] as? String {
                // Handle error
                self.handleError(message)
            }
        }
        
        socket.on(clientEvent: .disconnect) { data, ack in
            print("Disconnected")
            // Handle disconnect
        }
    }
    
    func handleAIResponse(_ message: String) {
        // Override in your view model
    }
    
    func handleError(_ error: String) {
        // Override in your view model
    }
}

// Usage
let chatService = ChatService(baseURL: "http://192.168.1.18:3000")
chatService.connect()
chatService.sendMessage("What time is it?")
```

### Kotlin (Android) - Using socket.io-client

```kotlin
import io.socket.client.IO
import io.socket.client.Socket
import org.json.JSONObject

class ChatService(private val baseURL: String) {
    private var socket: Socket? = null
    
    fun connect() {
        val opts = IO.Options().apply {
            reconnection = true
            reconnectionAttempts = 5
            reconnectionDelay = 1000
        }
        
        socket = IO.socket(baseURL, opts).apply {
            on(Socket.EVENT_CONNECT) {
                println("Connected to Chaos AI")
                onConnected()
            }
            
            on("ai-response") { args ->
                val data = args[0] as JSONObject
                val response = data.getString("response")
                onMessage(response)
            }
            
            on("error") { args ->
                val data = args[0] as JSONObject
                val message = data.getString("message")
                onError(message)
            }
            
            on(Socket.EVENT_DISCONNECT) {
                println("Disconnected")
                onDisconnected()
            }
        }
        
        socket?.connect()
    }
    
    fun sendMessage(message: String) {
        val data = JSONObject().apply {
            put("message", message)
        }
        socket?.emit("message", data)
    }
    
    fun disconnect() {
        socket?.disconnect()
        socket = null
    }
    
    fun onConnected() {
        // Override in your ViewModel
    }
    
    fun onMessage(response: String) {
        // Override in your ViewModel
    }
    
    fun onError(error: String) {
        // Override in your ViewModel
    }
    
    fun onDisconnected() {
        // Override in your ViewModel
    }
}

// Usage
val chatService = ChatService("http://192.168.1.18:3000")
chatService.connect()
chatService.sendMessage("What time is it?")
```

## 📝 Important Notes

1. **Response Format**: All AI responses are limited to maximum 2 phrases/sentences for brevity.

2. **Connection Handling**: Always implement reconnection logic and handle connection states for better user experience.

3. **Error Handling**: The AI responses are intentionally playful and wrong, but errors from the server should be handled separately.

4. **Network Permissions**: Make sure your mobile app has proper network permissions configured.

5. **HTTPS in Production**: For production, use HTTPS URLs instead of HTTP.

6. **Testing**: Test the connection with the backend URL provided by the backend developer. Ensure both devices are on the same network for local development.

## 🆘 Troubleshooting

### Connection Issues

- **Can't connect**: Check if the backend URL is correct and the server is running
- **Connection timeout**: Ensure your device and server are on the same network (for local development)
- **CORS errors** (web only): The backend is configured to allow all origins by default

### Message Not Received

- Check if socket is connected before sending messages
- Verify you're listening to the correct event: `ai-response`
- Check server logs for errors

### Response Format

- All responses come as `{ response: string }`
- Responses are always strings, max 2 phrases

## 📞 Support

If you encounter any issues, contact the backend developer with:
- Error messages
- Connection status
- Network configuration details
- Device/platform information

