module app
{
  angular.module("ticTacToe", ["ngAnimate"]);
}

module app.game
{
   class MenuController
     {
       decisionMade: boolean;
       selectPlayerMode: boolean;
       opponent: boolean;         //Sets opponent. True for AI, False for another player
       token: string;             //Sets the chosen player token if player chooses to play against AI
       menuHeader: string;
       
       constructor()
       {
         this.token = "";
         this.opponent = false;
         this.decisionMade = false;
         this.selectPlayerMode = true;
         this.menuHeader = "Select Player Mode";
       }
       
       //Sets up single player if the player selects the option
       setSinglePlayer()
       {
         this.opponent = true;
         this.menuHeader = "Select Player Token";
         this.selectPlayerMode = false;
       }
       
       //Sets up two player if the player selects the option
       setTwoPlayer()
       {
         this.opponent = false;
         this.menuHeader = "Select Player One Token";
         this.selectPlayerMode = false;
       }
       
       //Assigns X to the token property of this controller to be passed down to the GameController
       setXToken()
       {
         this.token = "X";
         this.decisionMade = true;
       }
       
       //Assigns O to the token property of this controller to be passed down to the GameController
       setOToken()
       {
         this.token = "O";
         this.decisionMade = true;
       }
     }
   
   angular.module("ticTacToe").controller("MenuController", MenuController)
}

module app.game
 {
     //Controller for handling Two player games
     class GameBoardControllerPlayer
      {               
        winningPlayer: string;       //String for notifying player of who won
        gameBoard: any;              //Game board service used to handling logic for turns
        playerService: any;          //Player service for handlying logic related to players
        
        
        constructor(GameBoardService: any, TwoPlayerService: any)
        {
          this.winningPlayer = "";
          this.gameBoard = GameBoardService;
          this.playerService = TwoPlayerService;
        }        
        
        setPlayerTokens(playerOneToken: string)
        {
          this.playerService.setPlayerTokens(playerOneToken);  //Sets player token, passed in from the
        }                                                      //Menu Controller
                
        playMove(cell: Cell)
        {          
          this.playerService.playMove(cell);
         }
        
        
      }      
        
      angular.module("ticTacToe").controller("GameBoardControllerPlayer", GameBoardControllerPlayer);
 }

module app.game
{
   //Controller for handling Single Player games
   class GameBoardControllerAI
     {
       gameBoard: any;
       playerService: any;
       
       constructor(GameBoardService: any, SinglePlayerService: any)
       {
         this.gameBoard = GameBoardService;
         this.playerService = SinglePlayerService;
         
       }
       
       setPlayerToken(playerToken: string)
       {
         this.playerService.setPlayerToken(playerToken);    //Sets player token, passed in from the 
       }                                                    //Menu controller
       
       
       playMove(cell: Cell)
       {
         this.playerService.playMove(cell);           
       }
       
       resetBoardDebug()
        {
          this.gameBoard.resetBoard();
          this.winningPlayer = "";
        }
       
       
     }
        
   angular.module("ticTacToe").controller("GameBoardControllerAI", GameBoardControllerAI);
}

module app.game
{
    export class Cell
      {
        id: number;
        placed: boolean;    //Keeps track if the token has been placed. If so, it appears on the board
        token: string;      //Keeps track of current token placed in cell
        highlight: string;  //When set, highlights appropriate winning Cells
        
        constructor(id: number)
        {
          this.id = id;
          this.token = "";
          this.placed = false;
          this.highlight = "";
        }
        
        
      }
}

module app.game
{
   export class Player
     {
       playerToken: string;
       
       constructor(token: string)
       {
         this.playerToken = token;
       }
       
       placeToken(cell: Cell)
       {
         if (!cell.token)
           {
             cell.token = this.playerToken
             cell.placed = true;
           }         
       }
     }
}

module app.game
{
  //Uses the Minimax algorithm found at http://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-3-tic-tac-toe-ai-finding-optimal-move/
  export class AIPlayer
    {
      AIToken: string;
      playerToken: string;
      
      constructor(playerToken: string, AIToken: string)
      {
        this.AIToken = AIToken;
        this.playerToken = playerToken;
      }
      
      //Checks for moves left on the board, returns true if there are moves left, false otherwise
      isMovesLeft(grid: Array<Cell>)
      {
        for (let r = 0; r < grid.length; r++)
          {
            for (let c = 0; c < grid[0].length; c++)
              {
                if (grid[r][c].token === "")
                  {
                    return true;
                  }
              }
          }
        return false;
      }
      
      //Finds the best move using the MiniMax Function. This is set for finding the best move
      //for the Minimizing player. (In this case, the CPU)
      findBestMove(grid: Array<Cell>)
      {
        let bestVal = 1000;
        var bestMove = {};
        
        for (let r = 0; r < grid.length; r++)
          {
            for (let c = 0; c < grid[0].length; c++)
              {
                if (grid[r][c].token === "")
                  {
                    grid[r][c].token = this.AIToken;
                    
                    let moveVal = this.miniMax(grid, 0, true);
                   
                    
                    grid[r][c].token = "";
                    
                    if (moveVal < bestVal)
                      {
                        bestMove.row = r;
                        bestMove.col = c;
                        bestVal = moveVal;
                      }
                  }
              }
          }
        return bestMove; //Returns an object that contains the row and
                         //colmn the cpu should place token in
        
      }
      
      evaluateBoard(grid: Array<Cell>)
       {
        
        //Check rows for win
        for (let r = 0; r < grid.length; r++)
          {
            if (grid[r][0].token === grid[r][1].token && grid[r][1].token === grid[r][2].token)
              {
                if (grid[r][0].token === this.AIToken)
                  {
                    return -10;
                  }
                else if (grid[r][0].token === this.playerToken)
                  {
                    return 10;
                  }
              }
          }
        
        //Check Columns for win
        for (let c = 0; c < grid.length; c++)
          {
            if (grid[0][c].token === grid[1][c].token && grid[1][c].token === grid[2][c].token)
              {
                if (grid[0][c].token === this.AIToken)
                  {
                    return -10;
                  }
                else if (grid[0][c].token === this.playerToken)
                  {
                    return 10;
                  }
              }
          }
        
        //Check Diagonals for win
        if (grid[0][0].token === grid[1][1].token && grid[1][1].token === grid[2][2].token)
          {
            if (grid[0][0].token === this.AIToken)
              {
                return -10;
              }
            else if (grid[0][0].token === this.playerToken)
              {
                return 10;
              }
          }
         if (grid[0][2].token === grid[1][1].token && grid[1][1].token === grid[2][0].token)
           {
             if (grid[0][2].token === this.AIToken)
               {
                 return -10;
               }
             else if (grid[0][2].token === this.playerToken)
               {
                 return 10;
               }
           }
         
         return 0;
        
      }
      
      //The MiniMax Function. Finds best score, based on values set in EvaluateBoard function
      miniMax(grid: Array<Cell>, depth: number, isMax: boolean)
      {
        
        let score = this.evaluateBoard(grid);
        
        if (score === 10) { return score - depth; }
        
        if (score === -10) { return score + depth; }
        
        if (this.isMovesLeft(grid) === false)
          {
            return 0;
          }
        
        
        if (isMax)
          {
            let best = -100000;
            
            for (let r = 0; r < grid.length; r++)
              {
                for (let c = 0; c < grid[0].length; c++)
                  {
                    if (grid[r][c].token === "")
                      {
                        grid[r][c].token = this.playerToken;
                        
                        best = Math.max( best, this.miniMax(grid, depth + 1, !isMax));
                        
                        grid[r][c].token = "";
                      }
                  }
              }
            
            return best + depth;
          }
        else
          {
            let best = 100000;
            
            for (let r = 0; r < grid.length; r++)
              {
                for (let c = 0; c < grid[0].length; c++)
                  {
                    if (grid[r][c].token === "")
                      {
                        grid[r][c].token = this.AIToken;
                        
                        best = Math.min( best, this.miniMax(grid, depth +1, !isMax));
                        
                        grid[r][c].token = "";
                      }
                  }
              }
            return best - depth;
          }
      }
      
      //function that has CPU place a token
      placeToken(grid: Array<Cell>)
      {
        //If the middle cell has not been taken, take it before anything else
        if (grid[1][1].token === "")
          {
            grid[1][1].token = this.AIToken;
            grid[1][1].placed = true
          }
        else
          {
            //Else, use the minimax function to find best move
            let bestMove = this.findBestMove(grid);
            grid[bestMove.row][bestMove.col].token = this.AIToken;
            grid[bestMove.row][bestMove.col].placed = true;
          }       
      }
    }
}

module app.services
{
   export class GameBoardService
     {
       grid: Array<Cell>         //The array of cells that make up the game board
       
       constructor()
       {
         this.grid = [ [new app.game.Cell(1), new app.game.Cell(2), new app.game.Cell(3)],
                       [new app.game.Cell(4), new app.game.Cell(5), new app.game.Cell(6)],
                       [new app.game.Cell(7), new app.game.Cell(8), new app.game.Cell(9)] ];
       }
       
       checkWinner(playerToken: string)        
        {
          
          let winner: boolean = false;
                   
          //Check rows for winner
          for (let r = 0; r < this.grid.length; r++)
            {
              let rowMatch = true;
              for (let c = 0; c < this.grid[0].length; c++)
                {
                  if (this.grid[r][c].token !== playerToken)
                    {
                      rowMatch = false;
                      break;
                    }
                  
                }
              
              if (rowMatch)
                {
                  //Highlight winning cells
                  for (let i = 0; i < 3; i++)
                    {
                      this.grid[r][i].highlight = "#00008B";
                    }
                  
                  return true;
                }
            }
          
               //Check columns for winner            
              for (let c = 0; c < this.grid[0].length; c++)
                {
                  var colMatch = true;
                  for (let r = 0; r < this.grid.length; r++)
                    {
                      if (this.grid[r][c].token !== playerToken)
                        {
                          colMatch = false;
                          break;
                        }
                    }
                  
                  if (colMatch)
                    {
                      //Highlight winning cells
                      for (let i = 0; i < 3; i++)
                        {
                          this.grid[i][c].highlight = "#00008B";
                        }
                      return true;
                    }
                }

          

              //Check for Diagonal Wins (Starting from top left corner)
              let diagTop: boolean = true;
              for (let r = 0, c = 0; r < 3; r++, c++)
                {
                  if (this.grid[r][c].token !== playerToken)
                    {
                      diagTop = false;
                      break;
                    }
                }
              
              if (diagTop)
                {
                  //Highlight winning cells
                  for (let r = 0, c = 0; r < 3; r++, c++)
                    {
                      this.grid[r][c].highlight = "#00008B";
                    }
                   return true;
                }
            
                   
              //Check for Diagonal Wins (Starting from bottom left corner)
              let diagBottom: boolean = true;
              
              for (let r = 2, c = 0; c < 3; r--, c++)
                {
                  if (this.grid[r][c].token !== playerToken)
                    {
                      diagBottom = false;
                      break;
                    }
                }
              
              if (diagBottom)
                {
                  for (let r = 2, c = 0; c < 3; r--, c++)
                    {
                      this.grid[r][c].highlight = "#00008B";
                    }
                   return true;
                }
            
        }
       
       resetBoard()
       {
         for (let r = 0; r < this.grid.length; r++)
              {
                 for (let c = 0; c < this.grid[0].length; c++)
                   {
                     this.grid[r][c].token = "";
                     this.grid[r][c].highlight = "";
                   }
              }
       }
       
       //Checks if the current cell player has clicked on is occumped,
       //returns true if occupied, false otherwise
       checkOccupied(token: string)
       {
         if (token)
           {
             return true;
           }
         else
           {
             return false;
           }
       }
       
       //iterates through all cells in gameboard, if all are taken,
       //returns true (this is called after checkWinner function)
       checkTie()
       {
         let filled = true;
         
         for (let r = 0; r < this.grid.length; r++)
           {
             for (let c = 0; c < this.grid[0].length; c++)
               {
                   if (this.grid[r][c].token === "")
                   {
                     filled = false;
                     break;
                   }
               }
           }

         return filled;
       }
      
      //Sets appropriate CSS styling for each individual cell.
      //If cell.highlight is assigned, winning cells are highlighted
      setCellStyle(cell: Cell)
         {
           if (cell.id === 1)
             {
               return { "border-bottom-style": "hidden",
                        "border-right-style": "hidden",
                        "background-color": cell.highlight};
             }
           else if (cell.id === 2)
             {
               return {"border-bottom-style": "hidden",
                       "border-right-style": "hidden",
                       "background-color": cell.highlight};
             }
           else if (cell.id === 3)
             {
               return {"border-bottom-style": "hidden",
                       "background-color": cell.highlight};
             }
           else if (cell.id === 4)
             {
               return {"border-bottom-style": "hidden",
                       "border-right-style": "hidden",
                       "background-color": cell.highlight};
             }
           else if (cell.id === 5)
             {
               return {"border-bottom-style": "hidden",
                       "border-right-style": "hidden",
                       "background-color": cell.highlight};
             }
           else if (cell.id === 6)
             {
               return {"border-bottom-style": "hidden",
                       "background-color": cell.highlight};
             }
           else if (cell.id === 7)
             {
               return {"border-right-style": "hidden",
                       "background-color": cell.highlight};
             }
           else if (cell.id === 8)
             {
               return {"border-right-style": "hidden",
                       "background-color": cell.highlight};
             }
           else
             {
               return {"background-color": cell.highlight};
             }
         }
      
      //Sets the AI token to be the opposite token of the player
      setAIToken(playerToken: string)
       {
         if (playerToken === "O")
           {
             return "X";
           }
         else
           {
             return "O";
           }
       }
       
     }
        
   angular.module("ticTacToe").service("GameBoardService", GameBoardService);
}

module app.services
{
  //Service that handles logic for Two Player Game
  export class TwoPlayerService
    {
      gameBoard: any;
      players: Array<Player>;
      activePlayer: Player;
      winningPlayer: string;
      
        
      constructor(GameBoardService: any, public $timeout)
      {
        this.gameBoard = GameBoardService;
        this.players = [new app.game.Player("X"), new app.game.Player("O")];
        this.activePlayer = this.players[0];  //Sets active player to initially be the first player
        this.winningPlayer = "";
      }
      
      //Checks if cell that has been clicked on is occupied, if so return, otherwise
      //place token and end turn
      playMove(cell: Cell)
        {
          if (this.gameBoard.checkOccupied(cell.token))
            {
              return;
            }
          else
            {
              this.activePlayer.placeToken(cell);
              this.endTurn(this.activePlayer.playerToken);
            }
        }
      
      //Checks for wins or ties, if none, switches the active player
      endTurn(playerToken: string)
      {
         if (this.gameBoard.checkWinner(playerToken))
            {
               
               this.winningPlayer = `Player ${playerToken} has won!`;
               this.resetBoard();
               
              
            }
          else if (this.gameBoard.checkTie())
            {
              this.resetBoard();
              this.winningPlayer = "Its a draw!";
              
              
            }
          else
            {
              this.changePlayer();
              this.winningPlayer = "";
            }
      }
      
      //When called changes the active player to the opposite of the current player
      changePlayer()
      {
        if (this.activePlayer === this.players[0])
            {
              this.activePlayer = this.players[1];
            }
          else
            {
              this.activePlayer = this.players[0];
            }
      }
      
      //Sets player One token, passed in from the Menu Controller,
      //after that, sets player two token to be the opposite of player one token
      setPlayerTokens(playerOneToken: string)
      {
        this.players[0].playerToken = playerOneToken;

              if (playerOneToken === "X")
                {
                  this.players[1].playerToken = "O";
                }
              else
                {
                  this.players[1].playerToken = "X";
                }
      }
      
      //Starts a timer for 1500ms (1.5 seconds) and wipes the board.
      //Also sets the active player back to player One
      resetBoard()
      {
        this.$timeout(() => {
                 this.gameBoard.resetBoard();
                 this.winningPlayer = "";
                 this.activePlayer = this.players[0];
               }, 1500)
      }
      
    }
   
   angular.module("ticTacToe").service("TwoPlayerService", TwoPlayerService);
}

module app.services
{
  //Service for handling Single Player Game Logic
  export class SinglePlayerService
    {
      gameBoard: any;
      winningPlayer: string;
      human: Player;
      AI: AIPlayer;
      
      constructor(GameBoardService: any, public $timeout)
      {
        this.human = new app.game.Player("X");
        this.AI = new app.game.AIPlayer("X", "O");
        this.winningPlayer = "";
        this.gameBoard = GameBoardService;
      }
      
      //Sets Player and AI tokens, given a Token string.
      setPlayerToken(playerToken: string)
       {
         this.human.playerToken = playerToken;
         this.AI.AIToken = this.gameBoard.setAIToken(playerToken);
         this.AI.playerToken = playerToken;
       }
      
      //Plays a move on click of a cell
      playMove(cell: Cell)
      {
        //Just return if cell clicked is occupied
        if (this.gameBoard.checkOccupied(cell.token))
            {
              return;
            }
         
         this.human.placeToken(cell);   //If cell is not occupied place token
             
         if (this.gameBoard.checkWinner(this.human.playerToken)) //Check if player has won after token
           {                                                     //place.
             this.winningPlayer = "You have won!";
             this.resetBoard();
           }
         else if (this.gameBoard.checkTie()) //Check for ties
           {

             this.winningPlayer = "Its a tie!";
             this.resetBoard();
           }
         else
           { 
             //If no wins or ties are present. AI places its token
             this.AI.placeToken(this.gameBoard.grid);
             if (this.gameBoard.checkWinner(this.AI.AIToken))  //Check for wins after AI places token
               {
                 this.winningPlayer = "The AI has outsmarted you!";
                 this.resetBoard();
               }
           }
      }
      
      //Starts a timer for 1500ms (1.5 seconds) and wipes the board.
      resetBoard()
      {
        this.$timeout(() => {
                 this.gameBoard.resetBoard();
                 this.winningPlayer = "";
               }, 1500)
      }
      
      
      
    }
        
   angular.module("ticTacToe").service("SinglePlayerService", SinglePlayerService);
}

