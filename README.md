# 🤖 Chaos Backend

> *"The AI assistant that's confidently wrong about everything, but in style!"*

A delightfully broken AI backend built with NestJS that provides hilariously unhelpful responses powered by Groq's Llama model. Perfect for when you want an AI that thinks clocks are "round calendars" and time is measured in soup recipes.

## 🎭 What is This?

Rumor has it that this backend was built by a mischievous developer who got tired of AI assistants actually being helpful. Instead, you get an AI that:

- Transforms "What time is it?" into a dissertation on time-traveling hamsters
- Converts task reminders into philosophical discussions about space-pigeons
- Delivers wrong answers with the confidence of a cat who just knocked your coffee off the table

**But seriously**, this is a production-ready NestJS backend with real-time WebSocket support and a REST API for interacting with a humorously chaotic AI assistant.

## ✨ Features

- 🎪 **Chaotic AI Responses**: Powered by Groq's Llama 3.3 70B model, configured to be playfully wrong
- ⚡ **Real-time Messaging**: WebSocket gateway for instant AI interactions
- 🔌 **REST API**: Traditional HTTP endpoints for those who prefer it old school
- 📝 **Concise Responses**: Max 2 phrases (because even chaos has limits)
- 🏗️ **Clean Architecture**: Follows NestJS best practices and clean architecture principles

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Groq API key (rumor has it you can get one from [Groq](https://console.groq.com))

### Installation

```bash
# Clone the repository (or don't, we won't judge)
git clone <your-repo-url>
cd chaos-backend

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```bash
GROQ_API_KEY=your_groq_api_key_here
PORT=3000  # Optional, defaults to 3000
```

**Pro tip**: Don't commit your `.env` file. We're chaotic, not reckless.

### Running the Application

```bash
# Development mode (with hot-reload)
npm run start:dev

# Production mode
npm run start:prod

# Standard start
npm run start
```

The server will start on `http://localhost:3000` (or whatever PORT you specified).

## 📡 API Endpoints

### REST API

#### POST `/ai/chat`

Send a message and receive a delightfully wrong response.

**Request:**
```json
{
  "message": "What time is it?"
}
```

**Response:**
```json
{
  "response": "Time is just a social construct invented by soup enthusiasts to coordinate recipe cook-offs. I'm pretty sure it's currently 'Creamy Tomato O'Clock' somewhere in the world."
}
```

### WebSocket Gateway

Connect to the WebSocket server for real-time interactions:

**Connection:**
```javascript
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to chaos!');
  
  // Send a message
  socket.emit('message', { message: 'Remind me to call mom' });
});

// Receive AI response
socket.on('ai-response', (data) => {
  console.log('AI says:', data.response);
});

// Handle errors (because even chaos has limits)
socket.on('error', (error) => {
  console.error('Something went wrong:', error);
});
```

**Events:**
- `message`: Send a message to the AI (payload: `{ message: string }`)
- `ai-response`: Receive the AI's chaotic response (payload: `{ response: string }`)
- `error`: Handle errors (payload: `{ message: string }`)

## 🎯 How It Works

1. **You ask a question** (like a normal person)
2. **The AI misinterprets it completely** (with style)
3. **You get a funny, wrong answer** (maximum 2 phrases, because we respect your time)

The AI is configured with:
- High temperature (1.4) for maximum creativity and chaos
- Strict 2-phrase limit for concise wrongness
- A system prompt that encourages playful misunderstanding

## 🏗️ Project Structure

```
chaos-backend/
├── src/
│   ├── ai/
│   │   ├── dto/              # Data transfer objects
│   │   ├── ai.controller.ts  # REST API controller
│   │   ├── ai.gateway.ts     # WebSocket gateway
│   │   ├── ai.module.ts      # AI module
│   │   └── ai.service.ts     # Core AI logic
│   ├── app.module.ts         # Main application module
│   └── main.ts               # Application entry point
├── .env                      # Environment variables (not committed)
└── package.json
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

*Note: Tests are still being written. Much like the AI, our test coverage is confidently incomplete.*

## 📦 Built With

- [NestJS](https://nestjs.com/) - A progressive Node.js framework
- [Groq SDK](https://github.com/groq/groq-sdk) - Lightning-fast AI inference
- [Socket.IO](https://socket.io/) - Real-time bidirectional communication
- [TypeScript](https://www.typescriptlang.org/) - Because type safety is no joke (unlike our AI)

## 🤝 Contributing

Contributions are welcome! Whether you want to:
- Make the AI even more delightfully wrong
- Add new features (but remember: wrong is right)
- Fix bugs (if they're not intentional chaos)
- Improve documentation (especially if you can make it funnier)

Just open a PR and we'll review it. We promise to be more helpful than our AI.

## 📝 License

This project is unlicensed. Use at your own risk. The AI is not responsible for any existential crises caused by being told that clocks are round calendars.

## 🙏 Acknowledgments

- Groq for the fast AI inference
- The time-traveling hamsters for inspiration
- Coffee companies for inventing productivity (allegedly)
- That one cat who knocked something off a shelf (you know who you are)

---

**Disclaimer**: This AI is intentionally unhelpful. If you need actual help, you're probably using the wrong tool. But hey, at least you'll laugh!

For real questions or issues, please open an issue on GitHub (but don't expect helpful answers from the AI).
