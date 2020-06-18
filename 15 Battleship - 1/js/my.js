// Здесь наше представление

var view = {
    displayMassage: function(msg){
        var messageArea = document.querySelector("#messageArea");
        messageArea.innerHTML = msg;
    },

    displayHitt: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit"); 
    },

    displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss"); 
    },
};

// Зедесь наша модель поведения.

var model = {
    boardSize: 7,  // размер игровового поля
    numShips: 3,   // кодичество кораблей в игре
    shipLength: 3, // длина коробля
    shipsSunk: 0,  // количество потопленных короблей
    
    ships: [
        ship1 = {location: ["0", "0", "0"], hits: ["", "", ""]},
        ship2 = {location: ["0", "0", "0"], hits: ["", "", ""]}, 
        ship3 = {location: ["0", "0", "0"], hits: ["", "", ""]}
    ],

    fire: function(guess){ // получает координаты выстрела
        for(var i = 0; i < this.numShips; i++){
            var ship = this.ships[i];
            var index = ship.location.indexOf(guess);
            if(index >= 0){
                ship.hits[index] = "hit";
                view.displayHitt(guess);
                view.displayMassage("HIT!!!")
                if(this.isSunk(ship)){
                    view.displayMassage("You sank !")
                    this.shipsSunk++;
                }
                return true; // Есть попадание
            }
        }
        view.displayMiss(guess);
        view.displayMassage("You missed!")
        return false;
    },

    isSunk: function(ship){
        for(var i = 0; i < this.shipLength; i++){
            if(ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },
    // Генерация кораблуй на ишровом поле
    generateShipLocation: function(){
        var location;
        for(var i = 0; i < this.numShips; i++){
            do{
                location = this.generateShip();
            } while(this.collision(location));
            this.ships[i].location = location;
        }
    },
    generateShip: function(){
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if(direction === 1){
            // сгенерировать начальную позицию для горизонтального корабля
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }else{
            // сгенерировать начальную позицию для вертикального корабля
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocation = [];

        for(var i = 0; i < this.shipLength; i++){
            if(direction === 10){
                // добавить в массив для горизонтального корабля
                newShipLocation.push(row + "" + (col + i));
            }else{
                // добавить в массив для вертикального корабля
                newShipLocation.push((row + i) + "" + col);
            }
        }
        return newShipLocation;
    },
    collision: function(location){
        for(var i = 0; i < this.shipLength; i++){
            var ship = model.ships[1];
            for(var j = 0; j < location.length; j++){
                if(ship.location.indexOf(location[j]) >= 0){
                    return true;
                }
            }
        }
        return false;
    }
};

var controller = {
    gusses: 0,

    processGuess: function(guess){
        var location = parseGuess(guess);
        if(location){
            this.gusses++;
            var hit = model.fire(location);
            if(hit && model.shipsSunk === model.numShips){
                view.displayMassage("Вы потопили " + model.numShips + " корабля за: " + this.gusses + " выстрелов");
            }
        }
    }
}

function parseGuess(guess){
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if(guess === null || guess.length !== 2){
        alert("Вы ввели не верные координаты.");
    } else{
        firstChar = guess.charAt(0); //извлекаем из строки первый символ
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);
        
        if(isNaN(row) || isNaN(column)){
            alert("Вы ввели не верные координаты.");
        }else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize  ){
            alert("Вы ввели не верные координаты.");
        }else{
            return row + column;
        }
    } 
    return null;
}

function init(){
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = hendleFireButton;
    var guessInput =document.getElementById("guessInput"); // включаем Enter
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocation();
}

function hendleFireButton(){
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}

function handleKeyPress(e){
    var fireButton = document.getElementById("fireButton");
    if(e.keyCode === 13){
        fireButton.click();
        return false;
    }
}

window.onload = init;
 

