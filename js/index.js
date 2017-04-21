"use strict";
var app;
(function (app) {
    angular.module("ticTacToe", ["ngAnimate"]);
})(app || (app = {}));
(function (app) {
    var game;
    (function (game) {
        var MenuController = (function () {
            function MenuController() {
                this.token = "";
                this.opponent = false;
                this.decisionMade = false;
                this.selectPlayerMode = true;
                this.menuHeader = "Select Player Mode";
            }
            //Sets up single player if the player selects the option
            MenuController.prototype.setSinglePlayer = function () {
                this.opponent = true;
                this.menuHeader = "Select Player Token";
                this.selectPlayerMode = false;
            };
            //Sets up two player if the player selects the option
            MenuController.prototype.setTwoPlayer = function () {
                this.opponent = false;
                this.menuHeader = "Select Player One Token";
                this.selectPlayerMode = false;
            };
            //Assigns X to the token property of this controller to be passed down to the GameController
            MenuController.prototype.setXToken = function () {
                this.token = "X";
                this.decisionMade = true;
            };
            //Assigns O to the token property of this controller to be passed down to the GameController
            MenuController.prototype.setOToken = function () {
                this.token = "O";
                this.decisionMade = true;
            };
            return MenuController;
        }());
        angular.module("ticTacToe").controller("MenuController", MenuController);
    })(game = app.game || (app.game = {}));
})(app || (app = {}));
(function (app) {
    var game;
    (function (game) {
        //Controller for handling Two player games
        var GameBoardControllerPlayer = (function () {
            function GameBoardControllerPlayer(GameBoardService, TwoPlayerService) {
                this.winningPlayer = "";
                this.gameBoard = GameBoardService;
                this.playerService = TwoPlayerService;
            }
            GameBoardControllerPlayer.prototype.setPlayerTokens = function (playerOneToken) {
                this.playerService.setPlayerTokens(playerOneToken); //Sets player token, passed in from the
            }; //Menu Controller
            GameBoardControllerPlayer.prototype.playMove = function (cell) {
                this.playerService.playMove(cell);
            };
            return GameBoardControllerPlayer;
        }());
        angular.module("ticTacToe").controller("GameBoardControllerPlayer", GameBoardControllerPlayer);
    })(game = app.game || (app.game = {}));
})(app || (app = {}));
(function (app) {
    var game;
    (function (game) {
        //Controller for handling Single Player games
        var GameBoardControllerAI = (function () {
            function GameBoardControllerAI(GameBoardService, SinglePlayerService) {
                this.gameBoard = GameBoardService;
                this.playerService = SinglePlayerService;
            }
            GameBoardControllerAI.prototype.setPlayerToken = function (playerToken) {
                this.playerService.setPlayerToken(playerToken); //Sets player token, passed in from the 
            }; //Menu controller
            GameBoardControllerAI.prototype.playMove = function (cell) {
                this.playerService.playMove(cell);
            };
            GameBoardControllerAI.prototype.resetBoardDebug = function () {
                this.gameBoard.resetBoard();
                this.winningPlayer = "";
            };
            return GameBoardControllerAI;
        }());
        angular.module("ticTacToe").controller("GameBoardControllerAI", GameBoardControllerAI);
    })(game = app.game || (app.game = {}));
})(app || (app = {}));
(function (app) {
    var game;
    (function (game) {
        var Cell = (function () {
            function Cell(id) {
                this.id = id;
                this.token = "";
                this.placed = false;
                this.highlight = "";
            }
            return Cell;
        }());
        game.Cell = Cell;
    })(game = app.game || (app.game = {}));
})(app || (app = {}));
(function (app) {
    var game;
    (function (game) {
        var Player = (function () {
            function Player(token) {
                this.playerToken = token;
            }
            Player.prototype.placeToken = function (cell) {
                if (!cell.token) {
                    cell.token = this.playerToken;
                    cell.placed = true;
                }
            };
            return Player;
        }());
        game.Player = Player;
    })(game = app.game || (app.game = {}));
})(app || (app = {}));
(function (app) {
    var game;
    //Uses the Minimax Algorithm found at http://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-3-tic-tac-toe-ai-finding-optimal-move/
    (function (game) {
        var AIPlayer = (function () {
            function AIPlayer(playerToken, AIToken) {
                this.AIToken = AIToken;
                this.playerToken = playerToken;
            }
            //Checks for moves left on the board, returns true if there are moves left, false otherwise
            AIPlayer.prototype.isMovesLeft = function (grid) {
                for (var r = 0; r < grid.length; r++) {
                    for (var c = 0; c < grid[0].length; c++) {
                        if (grid[r][c].token === "") {
                            return true;
                        }
                    }
                }
                return false;
            };
            //Finds the best move using the MiniMax Function. This is set for finding the best move
            //for the Minimizing player. (In this case, the CPU)
            AIPlayer.prototype.findBestMove = function (grid) {
                var bestVal = 1000;
                var bestMove = {};
                for (var r = 0; r < grid.length; r++) {
                    for (var c = 0; c < grid[0].length; c++) {
                        if (grid[r][c].token === "") {
                            grid[r][c].token = this.AIToken;
                            var moveVal = this.miniMax(grid, 0, true);
                            grid[r][c].token = "";
                            if (moveVal < bestVal) {
                                bestMove.row = r;
                                bestMove.col = c;
                                bestVal = moveVal;
                            }
                        }
                    }
                }
                return bestMove; //Returns an object that contains the row and
                //colmn the cpu should place token in
            };
            AIPlayer.prototype.evaluateBoard = function (grid) {
                //Check rows for win
                for (var r = 0; r < grid.length; r++) {
                    if (grid[r][0].token === grid[r][1].token && grid[r][1].token === grid[r][2].token) {
                        if (grid[r][0].token === this.AIToken) {
                            return -10;
                        }
                        else if (grid[r][0].token === this.playerToken) {
                            return 10;
                        }
                    }
                }
                //Check Columns for win
                for (var c = 0; c < grid.length; c++) {
                    if (grid[0][c].token === grid[1][c].token && grid[1][c].token === grid[2][c].token) {
                        if (grid[0][c].token === this.AIToken) {
                            return -10;
                        }
                        else if (grid[0][c].token === this.playerToken) {
                            return 10;
                        }
                    }
                }
                //Check Diagonals for win
                if (grid[0][0].token === grid[1][1].token && grid[1][1].token === grid[2][2].token) {
                    if (grid[0][0].token === this.AIToken) {
                        return -10;
                    }
                    else if (grid[0][0].token === this.playerToken) {
                        return 10;
                    }
                }
                if (grid[0][2].token === grid[1][1].token && grid[1][1].token === grid[2][0].token) {
                    if (grid[0][2].token === this.AIToken) {
                        return -10;
                    }
                    else if (grid[0][2].token === this.playerToken) {
                        return 10;
                    }
                }
                return 0;
            };
            //The MiniMax Function. Finds best score, based on values set in EvaluateBoard function
            AIPlayer.prototype.miniMax = function (grid, depth, isMax) {
                var score = this.evaluateBoard(grid);
                if (score === 10) {
                    return score - depth;
                }
                if (score === -10) {
                    return score + depth;
                }
                if (this.isMovesLeft(grid) === false) {
                    return 0;
                }
                if (isMax) {
                    var best = -100000;
                    for (var r = 0; r < grid.length; r++) {
                        for (var c = 0; c < grid[0].length; c++) {
                            if (grid[r][c].token === "") {
                                grid[r][c].token = this.playerToken;
                                best = Math.max(best, this.miniMax(grid, depth + 1, !isMax));
                                grid[r][c].token = "";
                            }
                        }
                    }
                    return best + depth;
                }
                else {
                    var best = 100000;
                    for (var r = 0; r < grid.length; r++) {
                        for (var c = 0; c < grid[0].length; c++) {
                            if (grid[r][c].token === "") {
                                grid[r][c].token = this.AIToken;
                                best = Math.min(best, this.miniMax(grid, depth + 1, !isMax));
                                grid[r][c].token = "";
                            }
                        }
                    }
                    return best - depth;
                }
            };
            //function that has CPU place a token
            AIPlayer.prototype.placeToken = function (grid) {
                //If the middle cell has not been taken, take it before anything else
                if (grid[1][1].token === "") {
                    grid[1][1].token = this.AIToken;
                    grid[1][1].placed = true;
                }
                else {
                    //Else, use the minimax function to find best move
                    var bestMove = this.findBestMove(grid);
                    grid[bestMove.row][bestMove.col].token = this.AIToken;
                    grid[bestMove.row][bestMove.col].placed = true;
                }
            };
            return AIPlayer;
        }());
        game.AIPlayer = AIPlayer;
    })(game = app.game || (app.game = {}));
})(app || (app = {}));
(function (app) {
    var services;
    (function (services) {
        var GameBoardService = (function () {
            function GameBoardService() {
                this.grid = [[new app.game.Cell(1), new app.game.Cell(2), new app.game.Cell(3)],
                    [new app.game.Cell(4), new app.game.Cell(5), new app.game.Cell(6)],
                    [new app.game.Cell(7), new app.game.Cell(8), new app.game.Cell(9)]];
            }
            GameBoardService.prototype.checkWinner = function (playerToken) {
                var winner = false;
                //Check rows for winner
                for (var r = 0; r < this.grid.length; r++) {
                    var rowMatch = true;
                    for (var c = 0; c < this.grid[0].length; c++) {
                        if (this.grid[r][c].token !== playerToken) {
                            rowMatch = false;
                            break;
                        }
                    }
                    if (rowMatch) {
                        //Highlight winning cells
                        for (var i = 0; i < 3; i++) {
                            this.grid[r][i].highlight = "#00008B";
                        }
                        return true;
                    }
                }
                //Check columns for winner            
                for (var c = 0; c < this.grid[0].length; c++) {
                    var colMatch = true;
                    for (var r = 0; r < this.grid.length; r++) {
                        if (this.grid[r][c].token !== playerToken) {
                            colMatch = false;
                            break;
                        }
                    }
                    if (colMatch) {
                        //Highlight winning cells
                        for (var i = 0; i < 3; i++) {
                            this.grid[i][c].highlight = "#00008B";
                        }
                        return true;
                    }
                }
                //Check for Diagonal Wins (Starting from top left corner)
                var diagTop = true;
                for (var r = 0, c = 0; r < 3; r++, c++) {
                    if (this.grid[r][c].token !== playerToken) {
                        diagTop = false;
                        break;
                    }
                }
                if (diagTop) {
                    //Highlight winning cells
                    for (var r = 0, c = 0; r < 3; r++, c++) {
                        this.grid[r][c].highlight = "#00008B";
                    }
                    return true;
                }
                //Check for Diagonal Wins (Starting from bottom left corner)
                var diagBottom = true;
                for (var r = 2, c = 0; c < 3; r--, c++) {
                    if (this.grid[r][c].token !== playerToken) {
                        diagBottom = false;
                        break;
                    }
                }
                if (diagBottom) {
                    for (var r = 2, c = 0; c < 3; r--, c++) {
                        this.grid[r][c].highlight = "#00008B";
                    }
                    return true;
                }
            };
            GameBoardService.prototype.resetBoard = function () {
                for (var r = 0; r < this.grid.length; r++) {
                    for (var c = 0; c < this.grid[0].length; c++) {
                        this.grid[r][c].token = "";
                        this.grid[r][c].highlight = "";
                    }
                }
            };
            //Checks if the current cell player has clicked on is occumped,
            //returns true if occupied, false otherwise
            GameBoardService.prototype.checkOccupied = function (token) {
                if (token) {
                    return true;
                }
                else {
                    return false;
                }
            };
            //iterates through all cells in gameboard, if all are taken,
            //returns true (this is called after checkWinner function)
            GameBoardService.prototype.checkTie = function () {
                var filled = true;
                for (var r = 0; r < this.grid.length; r++) {
                    for (var c = 0; c < this.grid[0].length; c++) {
                        if (this.grid[r][c].token === "") {
                            filled = false;
                            break;
                        }
                    }
                }
                return filled;
            };
            //Sets appropriate CSS styling for each individual cell.
            //If cell.highlight is assigned, winning cells are highlighted
            GameBoardService.prototype.setCellStyle = function (cell) {
                if (cell.id === 1) {
                    return { "border-bottom-style": "hidden",
                        "border-right-style": "hidden",
                        "background-color": cell.highlight };
                }
                else if (cell.id === 2) {
                    return { "border-bottom-style": "hidden",
                        "border-right-style": "hidden",
                        "background-color": cell.highlight };
                }
                else if (cell.id === 3) {
                    return { "border-bottom-style": "hidden",
                        "background-color": cell.highlight };
                }
                else if (cell.id === 4) {
                    return { "border-bottom-style": "hidden",
                        "border-right-style": "hidden",
                        "background-color": cell.highlight };
                }
                else if (cell.id === 5) {
                    return { "border-bottom-style": "hidden",
                        "border-right-style": "hidden",
                        "background-color": cell.highlight };
                }
                else if (cell.id === 6) {
                    return { "border-bottom-style": "hidden",
                        "background-color": cell.highlight };
                }
                else if (cell.id === 7) {
                    return { "border-right-style": "hidden",
                        "background-color": cell.highlight };
                }
                else if (cell.id === 8) {
                    return { "border-right-style": "hidden",
                        "background-color": cell.highlight };
                }
                else {
                    return { "background-color": cell.highlight };
                }
            };
            //Sets the AI token to be the opposite token of the player
            GameBoardService.prototype.setAIToken = function (playerToken) {
                if (playerToken === "O") {
                    return "X";
                }
                else {
                    return "O";
                }
            };
            return GameBoardService;
        }());
        services.GameBoardService = GameBoardService;
        angular.module("ticTacToe").service("GameBoardService", GameBoardService);
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
(function (app) {
    var services;
    (function (services) {
        //Service that handles logic for Two Player Game
        var TwoPlayerService = (function () {
            function TwoPlayerService(GameBoardService, $timeout) {
                this.$timeout = $timeout;
                this.gameBoard = GameBoardService;
                this.players = [new app.game.Player("X"), new app.game.Player("O")];
                this.activePlayer = this.players[0]; //Sets active player to initially be the first player
                this.winningPlayer = "";
            }
            //Checks if cell that has been clicked on is occupied, if so return, otherwise
            //place token and end turn
            TwoPlayerService.prototype.playMove = function (cell) {
                if (this.gameBoard.checkOccupied(cell.token)) {
                    return;
                }
                else {
                    this.activePlayer.placeToken(cell);
                    this.endTurn(this.activePlayer.playerToken);
                }
            };
            //Checks for wins or ties, if none, switches the active player
            TwoPlayerService.prototype.endTurn = function (playerToken) {
                if (this.gameBoard.checkWinner(playerToken)) {
                    this.winningPlayer = "Player " + playerToken + " has won!";
                    this.resetBoard();
                }
                else if (this.gameBoard.checkTie()) {
                    this.resetBoard();
                    this.winningPlayer = "Its a draw!";
                }
                else {
                    this.changePlayer();
                    this.winningPlayer = "";
                }
            };
            //When called changes the active player to the opposite of the current player
            TwoPlayerService.prototype.changePlayer = function () {
                if (this.activePlayer === this.players[0]) {
                    this.activePlayer = this.players[1];
                }
                else {
                    this.activePlayer = this.players[0];
                }
            };
            //Sets player One token, passed in from the Menu Controller,
            //after that, sets player two token to be the opposite of player one token
            TwoPlayerService.prototype.setPlayerTokens = function (playerOneToken) {
                this.players[0].playerToken = playerOneToken;
                if (playerOneToken === "X") {
                    this.players[1].playerToken = "O";
                }
                else {
                    this.players[1].playerToken = "X";
                }
            };
            //Starts a timer for 1500ms (1.5 seconds) and wipes the board.
            //Also sets the active player back to player One
            TwoPlayerService.prototype.resetBoard = function () {
                var _this = this;
                this.$timeout(function () {
                    _this.gameBoard.resetBoard();
                    _this.winningPlayer = "";
                    _this.activePlayer = _this.players[0];
                }, 1500);
            };
            return TwoPlayerService;
        }());
        services.TwoPlayerService = TwoPlayerService;
        angular.module("ticTacToe").service("TwoPlayerService", TwoPlayerService);
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
(function (app) {
    var services;
    (function (services) {
        //Service for handling Single Player Game Logic
        var SinglePlayerService = (function () {
            function SinglePlayerService(GameBoardService, $timeout) {
                this.$timeout = $timeout;
                this.human = new app.game.Player("X");
                this.AI = new app.game.AIPlayer("X", "O");
                this.winningPlayer = "";
                this.gameBoard = GameBoardService;
            }
            //Sets Player and AI tokens, given a Token string.
            SinglePlayerService.prototype.setPlayerToken = function (playerToken) {
                this.human.playerToken = playerToken;
                this.AI.AIToken = this.gameBoard.setAIToken(playerToken);
                this.AI.playerToken = playerToken;
            };
            //Plays a move on click of a cell
            SinglePlayerService.prototype.playMove = function (cell) {
                //Just return if cell clicked is occupied
                if (this.gameBoard.checkOccupied(cell.token)) {
                    return;
                }
                this.human.placeToken(cell); //If cell is not occupied place token
                if (this.gameBoard.checkWinner(this.human.playerToken)) {
                    this.winningPlayer = "You have won!";
                    this.resetBoard();
                }
                else if (this.gameBoard.checkTie()) {
                    this.winningPlayer = "Its a tie!";
                    this.resetBoard();
                }
                else {
                    //If no wins or ties are present. AI places its token
                    this.AI.placeToken(this.gameBoard.grid);
                    if (this.gameBoard.checkWinner(this.AI.AIToken)) {
                        this.winningPlayer = "The AI has outsmarted you!";
                        this.resetBoard();
                    }
                }
            };
            //Starts a timer for 1500ms (1.5 seconds) and wipes the board.
            SinglePlayerService.prototype.resetBoard = function () {
                var _this = this;
                this.$timeout(function () {
                    _this.gameBoard.resetBoard();
                    _this.winningPlayer = "";
                }, 1500);
            };
            return SinglePlayerService;
        }());
        services.SinglePlayerService = SinglePlayerService;
        angular.module("ticTacToe").service("SinglePlayerService", SinglePlayerService);
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
