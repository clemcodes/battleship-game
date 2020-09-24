// View object for display
var view = {
  displayMessage: function(message) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = message;
  },
  
  displayHit: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class","hit");
  },
  
  displayMiss: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class","miss");
  }
};

// Model object maintains the state of the game and has the logic relating to how the state changes

var model = {
  boardSize:7,
  numShips:3,
  shipLength:3,
  shipsSunk:0,
  
  // add the new ship's locations to the ships array
  
  ships:[
    { locations:[0, 0, 0], hits:["", "", ""] },
    { locations:[0, 0, 0], hits:["", "", ""] },
    { locations:[0, 0, 0], hits:["", "", ""] }
  ],

 
  generateShipLocations: function () {
    var locations;
     // loop for the number of ships we want to create
    for(var i = 0; i < this.numShips; i++) {
      // keep generating new locations until there's no collision
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      // once we have locations that work, assign to the ship's location property
      this.ships[i].locations = locations;
    }
    console.log("Ships array: ");
		console.log(this.ships);
  },



  generateShip: function () {
  // generate a randome direction for the new ship
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    
    if (direction === 1) {
      // generate a startting location for a horizontal ship
      row = Math.floor(Math.random()*this.boardSize);
      col = Math.floor(Math.random()*(this.boardSize - this.shipLength));
    } else {
      // generate a startting location for a vertical ship
      row = Math.floor(Math.random()*this.boardSize - this.shipLength);
      col = Math.floor(Math.random()*this.boardSize);
    }
  // generate a random location for the new ship
    var newShipLocations = [];
    for(var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        // add location to array for new horizontal ship
        newShipLocations.push(row + "" + (col + i));
      } else {
        // add location to array for new vertical ship
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },



  collision: function (locations) {
   // test to see if the new ship's location collide with any existing ship's locations
    for(var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      for(var j = 0; j < locations.length; j++) {
        if(ship.locations.indexOf(locations[j]) >= 0){
          return true;
        }
      }
    }
    return false;
  },

  
  // the logic to test guesses for hits and misses
  fire: function(guess) {
    
    for(var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      // return the index of that value in the array(or -1 if it cannot find it)
      var index = ship.locations.indexOf(guess);
      //check to see if the ship has already been hit
      if(ship.hits[index] === "hit"){
        view.displayMessage("Oops, you already hit that location!");
        return true;
      } else if (index >= 0) {
        // mark the hits array at the same index
        ship.hits[index] = "hit";
        // notify the view that we got a hit at the location in guess
        view.displayHit(guess);
        // ask the view to display the message
        view.displayMessage("HIT!");
        // check if the ship is sunk
        if(this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!");
          this.shipsSunk++;
        }
        return true;
      }     
    }
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false;
  },
  
  // determine if a ship is sunk
  isSunk: function(ship) {
    for(var i = 0; i < this.shipLength; i++) {
      if(ship.hits[i] !== "hit") {
        return false
      }
    }
    return true
  }
  
};

// glue everything together by getting a guess, processing the guess and getting it to the model
var controller = {
  guesses:0,
  
  processGuess: function(guess){
    var location = parseGuess(guess);
    if(location){
      this.guesses ++;
      var isHit = model.fire(location); 
      if(isHit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
      }
    }
  } 
 };

// helper function to process the guess
function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
  //validate input
  if(guess === null || guess.length !== 2){
    alert("Oops, please enter a letter and a number on the board");
  } else {
    //convert letter to a number
    var firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);
    
    if(isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board.");
    } else if (row < 0 || 
               row >= model.boardSize || 
               column < 0 || 
               column >= model.boardSize) {
      alert ("Oops, that's off the board!");
    } else {
      return row + column;
    } 
  }
  return null;
}

function init(){
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  // handle return key press
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
  
  model.generateShipLocations();
}

function handleFireButton() {
  // get the player's guess(value) from the form
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  // and get it to the controller
  controller.processGuess(guess);
  
  //reset form input to be empty;
  guessInput.value = "";
}

// the browser passes an event object to the handler. This object has info about which key was pressed
function handleKeyPress(e){
  var fireButton = document.getElementById("fireButton");
  if(e.keyCode === 13) {
    //cause the fire button to act like it was clicked
    fireButton.click();
    // so the form doesn't do anything else(like try to submit itself)
    return false;
  }
}

window.onload = init;

