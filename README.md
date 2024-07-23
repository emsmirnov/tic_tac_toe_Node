# Tic Tac Toe prototype on Node.js

```npx ts-node src/index.ts``` - Starts WebSocket server on ws://localhost:8080


```npx ts-node client.ts, npx ts-node client2.ts``` - Connects clients over WebSocket to server

The game will wait for both players to connect, after which the first player will be given the opportunity to make his move. Moves are commands in the console with numbers from 0 to 8, each number represents a cell number. Numbering is done from left to right, top to bottom. After each field, the current state of the game board is displayed in the console. Also, after each move, a check is made to see if there is a winner by matching the symbols on the field with winning combinations.

 const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
]
