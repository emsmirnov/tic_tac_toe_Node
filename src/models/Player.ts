export class Player {
  id: string;
  symbol: "X" | "O";

  constructor(id: string, symbol: "X" | "O") {
    this.id = id;
    this.symbol = symbol;
  }
}
