import { Game } from "../models/Game";
import { Player } from "../models/Player";

export class GameController {
  game: Game;

  constructor() {
    this.game = new Game();
  }

  addPlayer(playerId: string): Player | null {
    const symbol = this.game.players.length === 0 ? "X" : "O";
    const player = new Player(playerId, symbol);
    if (this.game.addPlayer(player)) {
      return player;
    }
    return null;
  }

  handleMove(
    playerId: string,
    position: number
  ): { board: (string | null)[]; winner: string | null } | null {
    const player = this.game.players.find((p) => p.id === playerId);
    if (player && this.game.makeMove(player, position)) {
      const winner = this.game.checkWinner();
      return { board: this.game.board, winner };
    }
    return null;
  }

  resetGame() {
    const symbols = this.game.players.map((player) => player.symbol).reverse();
    this.game.resetBoard();
    this.game.players.forEach((player, index) => {
      player.symbol = symbols[index] as "X" | "O";
    });
    this.game.currentPlayer = this.game.players[0];
  }
}
