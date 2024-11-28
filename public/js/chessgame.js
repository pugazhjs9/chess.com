// alert("hey")
const socket = io();


// socket.emit("pugazh")

// socket.on("data send", () => {
//     console.log("data risec");
// })

socket.on("gameOver", (data) => {
    alert(`Game Over! ${data.winner} wins. Reason: ${data.reason}`);
    // Optionally, you can redirect to a home page or show a restart button
});

socket.on("resetBoard", () => {
    resetChessBoard(); // Implement a function to reset the board display
});

function resetChessBoard() {
    document.querySelector(".chessboard").innerHTML = ""; // Clear the board
    // Reinitialize your chessboard logic here
}


const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = ()=>{
    const board = chess.board();
    boardElement.innerHTML = "";
    // console.log(board)
    board.forEach((row,rowindex)=>{
        row.forEach((square,squareindex)=>{
            // console.log(square)
            const squareElement = document.createElement("div");
            squareElement.classList.add("square",
                (rowindex+squareindex)%2===0 ? "light" : "dark"
            );
            squareElement.dataset.row = rowindex;
            squareElement.dataset.col = squareindex;

            if (square){
                const pieceElement = document.createElement("div");
                pieceElement.classList.add("piece",
                    square.color==="w" ? "white" : "black"
                );
                pieceElement.innerText = getPieceUnicode(square);
                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener("dragstart",(e)=>{
                    if (pieceElement.draggable){
                        draggedPiece = pieceElement;
                        sourceSquare = {row: rowindex, col: squareindex};
                        e.dataTransfer.setData("text/plain","");
                    }
                });

                pieceElement.addEventListener("dragend",(e)=>{
                    draggedPiece=null;
                    sourceSquare = null;
                });

                squareElement.appendChild(pieceElement);
            }
            squareElement.addEventListener("dragover",(e)=>{
                e.preventDefault();
            });

            squareElement.addEventListener("drop",(e)=>{
                e.preventDefault();
                if(draggedPiece){
                    const targetSource = {
                        row:parseInt(squareElement.dataset.row),
                        col:parseInt(squareElement.dataset.col),
                    };
                    handleMove(sourceSquare, targetSource);
                }
            })
            boardElement.appendChild(squareElement)
        })
    });
    if (playerRole==="b"){
        boardElement.classList.add("flipped")
    }else{
        boardElement.classList.remove("flipped")
    }
};

const handleMove = (source,target)=>{
    const move={
        from:`${String.fromCharCode(97+source.col)}${8-source.row}`,
        to:`${String.fromCharCode(97+target.col)}${8-target.row}`,
        promotion:"q",
    };
    socket.emit("move",move);
};

const getPieceUnicode = (piece)=>{
    const unicodePieces = {
        p: "♙", // Black Pawn
        r: "♜", // Black Rook
        n: "♞", // Black Knight
        b: "♝", // Black Bishop
        q: "♛", // Black Queen
        k: "♚", // Black King
        P: "♙", // White Pawn
        R: "♖", // White Rook
        N: "♘", // White Knight
        B: "♗", // White Bishop
        Q: "♕", // White Queen
        K: "♔"  // White King
      };
      
    //   // Example to print both pawns:
    //   console.log("Black Pawn:", unicodePieces['p']); // ♙
    //   console.log("White Pawn:", unicodePieces['P']); // ♙
      
    return unicodePieces[piece.type] || ""
};

socket.on("playerRole",(role)=>{
    playerRole = role;
    renderBoard();
});

socket.on("spectatorRole",()=>{
    playerRole=null;
    renderBoard();
});

socket.on("boardState",(fen)=>{
    chess.load(fen);
    renderBoard();
});

socket.on("move",(move)=>{
    chess.move(move);
    renderBoard();
});

renderBoard();