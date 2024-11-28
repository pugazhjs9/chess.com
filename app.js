const express = require("express");
const socket = require("socket.io");
const http = require("http");
const {Chess} = require("chess.js");
const path = require("path")

// creat http server and connect with express server
const app = express()
const server = http.createServer(app);
const io = socket(server)

// setup chess
const chess = new Chess();
let players = {}
let currectPlayer = "w"

// setup ejs or setup views folder
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));

app.get("/",(req,res)=>{
    res.render("index")
})

io.on("connection",function(uniquesocket){
    console.log("connected")

    if (!players.white){
        players.white = uniquesocket.id
        uniquesocket.emit("playerRole","w")
    }else if (!players.black){
        players.black = uniquesocket.id
        uniquesocket.emit("playerRole","b")
    }else{
        uniquesocket.emit("spectatorRole")
    }

    uniquesocket.on("disconnect",()=>{
        // console.log("dis")
        if (uniquesocket.id===players.white){
            delete players.white
            io.emit("gameOver", { winner: "Black", reason: "White player disconnected" });
        }else if(uniquesocket.id===players.black){
            delete players.black
            io.emit("gameOver", { winner: "White", reason: "Black player disconnected" });
        }
        resetGame();
    });

    uniquesocket.on("move",(move)=>{
        try{
            if (chess.turn()==="w" && uniquesocket.id!==players.white) return;
            if (chess.turn()==="b" && uniquesocket.id!==players.black) return;

            const result = chess.move(move);
            if(result){
                currectPlayer=chess.turn();
                io.emit("move",move);
                io.emit("boardState",chess.fen())
            }else{
                console.log("Invalid move :",move);
                uniquesocket.emit("invalidMove",move);
            }
        }catch(err){
            console.log(err)
            uniquesocket.emit("Invalid move :",move)
        }
    })
    // uniquesocket.on("pugazh",()=>{
    //     // console.log("pugazh received")
    //     // io.emit("data send") // this line will send the data to every one
    // })

    // uniquesocket.on("disconnect",()=>{
    //     console.log("disconnect")
    // })
})

function resetGame() {
    chess.reset(); // Reset chessboard to the initial state
    io.emit("resetBoard"); // Notify clients to reset the board
    currentPlayer = "w"; // Reset current player to white
}

server.listen(3000,()=>{
    console.log(`Server is running on http://localhost:3000`)
})