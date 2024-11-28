
# **Custom Chess Game** ♟️

A real-time multiplayer chess game built with **Node.js**, **Express**, **Socket.io**, and **Chess.js**, featuring drag-and-drop functionality and interactive gameplay for two players or spectators.

## **Features**
- **Real-time Gameplay**: Play chess with opponents in real-time using WebSockets.
- **Drag and Drop**: Move chess pieces on the board with drag-and-drop functionality.
- **Player Roles**: Automatically assigns roles (White/Black) to players or designates them as spectators if both roles are taken.
- **Board Flip**: Automatically flips the board for the black player’s view.
- **FEN Support**: Tracks the game state using FEN (Forsyth–Edwards Notation) for seamless updates and rendering.
- **Responsive Design**: Built using **Tailwind CSS** for a modern and responsive user interface.

---

## **Technologies Used**
- **Frontend**:
  - [Socket.io](https://socket.io/) for real-time communication.
  - [Chess.js](https://github.com/jhlywa/chess.js) for chess logic.
  - **EJS** for rendering dynamic HTML.
  - **Tailwind CSS** for styling and responsive design.

- **Backend**:
  - **Node.js** and **Express** for the server.
  - **Socket.io** for WebSocket communication.

---

## **Getting Started**

### **Prerequisites**
- [Node.js](https://nodejs.org/) installed on your system.
- [Git](https://git-scm.com/) for version control.

---

### **Installation**

1. Clone the repository:

```bash
git clone https://github.com/your-username/chess-game.git
cd chess-game
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

4. Open your browser and go to:

```
http://localhost:3000
```

---

## **Project Structure**
```
chess-game/
├── public/                    # Static files (CSS, client-side JS)
│   └── js/
│       └── chessgame.js       # Client-side logic
├── views/                     # EJS templates
│   └── index.ejs              # Main frontend template
├── app.js                     # Entry point of the application
├── server.js                  # Server-side logic
└── package.json               # Project dependencies and scripts
```

---

## **Gameplay**

1. **Player Role Assignment**:
   - First connected client is assigned the "White" role.
   - Second connected client is assigned the "Black" role.
   - Any additional clients are designated as spectators.

2. **Drag and Drop**:
   - Players can drag and drop pieces to make moves.
   - Moves are validated by the Chess.js library.
   - Invalid moves are rejected, and a message is logged.

3. **Real-Time Updates**:
   - Moves are broadcast to all connected clients.
   - Board state updates automatically for all players and spectators.

---

## **Usage**

### **Socket.io Events**

| Event            | Description                                          |
|------------------|------------------------------------------------------|
| `connection`     | Triggered when a client connects to the server.       |
| `playerRole`     | Emits the assigned player role to the client.         |
| `spectatorRole`  | Emits spectator role to clients when the game is full.|
| `move`           | Handles player moves and updates the game state.      |
| `boardState`     | Broadcasts the updated board state (FEN) to clients.  |
| `disconnect`     | Handles client disconnection and updates roles.       |

---

## **Frontend Code Overview**
- **Socket.io Initialization**:
  ```javascript
  const socket = io();
  ```

- **Chess Game Initialization**:
  ```javascript
  const chess = new Chess();
  ```

- **Drag and Drop**:
  Implements drag-and-drop functionality with event listeners for drag start, drag end, drag over, and drop.

- **Rendering the Board**:
  Generates HTML to display the chessboard based on the current FEN notation.

---

## **Backend Code Overview**
- **Server Initialization**:
  ```javascript
  const express = require('express');
  const http = require('http');
  const socket = require('socket.io');
  const { Chess } = require('chess.js');

  const app = express();
  const server = http.createServer(app);
  const io = socket(server);
  ```

- **Player Role Management**:
  Assigns "White" and "Black" roles or designates additional clients as spectators.

- **Move Handling**:
  Validates moves, updates the game state, and broadcasts updates to all connected clients.

-
