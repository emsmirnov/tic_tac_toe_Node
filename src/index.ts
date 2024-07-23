import WebSocket from "ws";
import { GameController } from "./services/GameService";

const wss = new WebSocket.Server({ port: 8080 });
const gameController = new GameController();

function broadcast(data: any) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on("connection", (ws) => {
  let playerId: string | null = null;

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());

    if (data.type === "join") {
      playerId = data.playerId;
      const player = playerId ? gameController.addPlayer(playerId) : null;
      if (player) {
        ws.send(JSON.stringify({ type: "joined", symbol: player.symbol }));
        if (gameController.game.players.length === 2) {
          broadcast({ type: "start" });
        }
      } else {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Can't join. All avaliable players connected",
          })
        );
      }
    } else if (data.type === "move") {
      if (playerId !== null) {
        const result = gameController.handleMove(playerId, data.position);
        if (result) {
          broadcast({
            type: "update",
            board: result.board,
            winner: result.winner,
            currentPlayer: gameController.game.currentPlayer?.symbol,
          });
          if (result.winner) {
            broadcast({ type: "end", winner: result.winner });
            gameController.resetGame();
            gameController.game.players.forEach((player) => {
              ws.send(
                JSON.stringify({ type: "reset", newSymbol: player.symbol })
              );
            });
          }
        } else {
          ws.send(JSON.stringify({ type: "error", message: "Invalid move" }));
        }
      }
    }
  });

  ws.on("close", () => {
    console.warn("Player disconnected. Reset Game.");
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
