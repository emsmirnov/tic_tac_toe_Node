import { Player } from "./Player";

export class Game {
  board: (string | null)[];
  currentPlayer: Player | null;
  players: Player[];

  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = null;
    this.players = [];
  }

  addPlayer(player: Player): boolean {
    if (this.players.length < 2) {
      this.players.push(player);
      if (this.players.length === 2) {
        this.currentPlayer = this.players[0];
      }
      return true;
    }
    return false;
  }

  makeMove(player: Player, position: number): boolean {
    if (this.currentPlayer?.id === player.id && this.board[position] === null) {
      this.board[position] = player.symbol;
      this.currentPlayer =
        this.currentPlayer === this.players[0]
          ? this.players[1]
          : this.players[0];
      return true;
    }
    return false;
  }

  checkWinner(): string | null {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return this.board[a];
      }
    }
    return this.board.includes(null) ? null : "No Winner. Draw.";
  }

  resetBoard() {
    this.board = Array(9).fill(null);
  }
}
