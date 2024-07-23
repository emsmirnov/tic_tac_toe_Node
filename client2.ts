import WebSocket from "ws";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ws = new WebSocket("ws://localhost:8080");
let playerId: string;
let playerSymbol: string;
let isMyTurn = false;

ws.on("open", () => {
  console.log("Connected to server");

  playerId = "player2";
  // Join the game
  ws.send(JSON.stringify({ type: "join", playerId }));
});

ws.on("message", (message) => {
  const data = JSON.parse(message.toString());

  if (data.type === "joined") {
    playerSymbol = data.symbol;
    console.log(`Player joined as ${data.symbol}`);
  } else if (data.type === "start") {
    console.log("Both players are connected. Game start!");
    if (playerSymbol === "X") {
      isMyTurn = true;
      promptMove();
    }
  } else if (data.type === "update") {
    printBoard(data.board);
    if (data.winner) {
      console.log(`Winner: ${data.winner}`);
      isMyTurn = false; // End current game
    } else {
      isMyTurn = data.currentPlayer === playerSymbol;
      if (isMyTurn) {
        promptMove();
      }
    }
  } else if (data.type === "reset") {
    console.log("Game reset. Symbols switched.");
    playerSymbol = data.newSymbol;
    isMyTurn = playerSymbol === "X";
    if (isMyTurn) {
      promptMove();
    }
  } else if (data.type === "error") {
    console.log(`Error: ${data.message}`);
    if (isMyTurn) {
      promptMove();
    }
  }
});

ws.on("close", () => {
  console.log("Disconnected from server");
  rl.close();
});

function promptMove() {
  rl.question("Enter your move (0-8): ", (input) => {
    const position = parseInt(input);
    if (!isNaN(position) && position >= 0 && position <= 8) {
      ws.send(JSON.stringify({ type: "move", playerId, position }));
    } else {
      console.log("Invalid move, please enter a number between 0 and 8.");
      promptMove();
    }
  });
}

function printBoard(board: (string | null)[]) {
  console.log(`
    ${board[0] || " "} | ${board[1] || " "} | ${board[2] || " "}
    ---------
    ${board[3] || " "} | ${board[4] || " "} | ${board[5] || " "}
    ---------
    ${board[6] || " "} | ${board[7] || " "} | ${board[8] || " "}
  `);
}
