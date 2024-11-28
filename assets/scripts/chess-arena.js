// Connect to the server using Socket.io
const socket = io();

// Listen for the 'gameOver' event and show an alert when the game ends
socket.on("gameOver", (data) => {
    alert(`Game Over! ${data.winner} wins. Reason: ${data.reason}`);
    // Optionally, you can redirect to a home page or show a restart button
});

// Listen for the 'resetBoard' event to reset the board
socket.on("resetBoard", () => {
    resetChessBoard(); // Reset the chessboard display
});

// Function to reset the chessboard on the client
function resetChessBoard() {
    document.querySelector(".chessboard").innerHTML = ""; // Clear the board
    // Reinitialize the board logic here
}

const chess = new Chess(); // Initialize the chess game
const boardElement = document.querySelector(".chessboard"); // Get the chessboard container

let draggedPiece = null; // Track the dragged piece
let sourceSquare = null; // Track the source square
let playerRole = null; // Track the current player's role

// Function to render the board
const renderBoard = () => {
    const board = chess.board(); // Get the current state of the board
    boardElement.innerHTML = ""; // Clear the board before rendering
    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add(
                "square",
                (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
            );
            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;

            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add("piece", square.color === "w" ? "white" : "black");
                pieceElement.innerText = getPieceUnicode(square);
                pieceElement.draggable = playerRole === square.color;

                // Event listener for when the piece starts dragging
                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowIndex, col: squareIndex };
                        e.dataTransfer.setData("text/plain", "");
                    }
                });

                // Event listener for when the piece ends dragging
                pieceElement.addEventListener("dragend", () => {
                    draggedPiece = null;
                    sourceSquare = null;
                });

                squareElement.appendChild(pieceElement);
            }

            // Handle dragover event to allow dropping the piece
            squareElement.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            // Handle the drop event for moving a piece
            squareElement.addEventListener("drop", (e) => {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col),
                    };
                    handleMove(sourceSquare, targetSquare); // Handle the move
                }
            });

            boardElement.appendChild(squareElement);
        });
    });

    // Flip the board for the black player
    if (playerRole === "b") {
        boardElement.classList.add("flipped");
    } else {
        boardElement.classList.remove("flipped");
    }
};

// Handle a move from the client
const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: "q", // Default promotion to queen
    };
    socket.emit("move", move); // Emit the move to the server
};

// Get the Unicode character for a chess piece
const getPieceUnicode = (piece) => {
    const unicodePieces = {
        p: "♙", 
        r: "♜",
        n: "♞", 
        b: "♝", 
        q: "♛", 
        k: "♚",
        P: "♙", 
        R: "♖", 
        N: "♘", 
        B: "♗", 
        Q: "♕", 
        K: "♔", 
    };
    return unicodePieces[piece.type] || "";
};

// Listen for player role assignment from the server
socket.on("playerRole", (role) => {
    playerRole = role; // Set the player role
    renderBoard(); // Re-render the board after role assignment
});

// Listen for spectator role assignment from the server
socket.on("spectatorRole", () => {
    playerRole = null; // Set the role to null for spectators
    renderBoard(); // Re-render the board for spectators
});

// Listen for the updated board state (FEN) from the server
socket.on("boardState", (fen) => {
    chess.load(fen); // Load the board state from the FEN string
    renderBoard(); // Re-render the board with the updated state
});

// Listen for a move from the server and apply it to the board
socket.on("move", (move) => {
    chess.move(move); // Apply the move to the local chess game
    renderBoard(); // Re-render the board with the updated move
});

// Initial render of the chessboard
renderBoard();
