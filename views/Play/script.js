const square_class = document.getElementsByClassName("square");
const white_checker_class = document.getElementsByClassName("white_checker");
const black_checker_class = document.getElementsByClassName("black_checker");
const moveLength = 80; // used to put checker in the good position acording to the size of square

//selected point coordinate
let selectedPieceX;
let selectedPieceY;

//two dimensional array who have attribute of what is in each square
const block = [];

//one dimensional array containing all white or black checkers
const w_checker = [];
const b_checker = [];

//Allow us to know if user selected a checker
let boolCheckerSelected = false;

//let us know if a checker can attack
let currentlyAttack = false;

//all checker to delete from the game in current round
let listDeadChecker = [];

//all checker that can be eaten by the opponent in the current round
let listPossibleChecker = [];

//used to know if from current position a checker can attack the opponent
let canAttack;

/*================= all function that allow initialisation of the game ================*/

/*
	TODO :
	- trouver d'où vient le coloriage en diag en noir
	- fin cleanup + ajout commentaires
	- update board mvt (play.js) éviter duplica code
	- pb sur déplacement de dames qui devient un pion
    - vérifier si on annule qu'un pion peut attaquer si on sélectionne un autre pion qui peut aussi attaquer
 */

//Definition of a checkers
const checker = function (piece, color, valX, valY) {
	this.id = piece;
	this.color = color;
	this.king = false;
	this.alive = true;
	this.attack = false;

	this.coordX = valX;
	this.coordY = valY;

	//each checkers can be clicked
	//when clicked it show moves he can do
	this.id.onclick = function () {
		//if there was already a checker selected
		if (boolCheckerSelected) {
			colorieCase(selectedPieceX, selectedPieceY, "#BA7A3A", false);
		}
		boolCheckerSelected = true;
		selectedPieceX = valX;
		selectedPieceY = valY;
		listPossibleChecker = [];
		showMoves(valX, valY);

	}
};


//Allow initialization of a square
const square_p = function (square, indeX, indeY) {
	this.id = square;
	this.ocupied = false;
	this.pieceId = undefined;
	this.greySquare = false;
	this.id.onclick = function () {

		if (currentlyAttack) {
			if (block[selectedPieceY][selectedPieceX].id.attack) {
				if (boolCheckerSelected && block[indeY][indeX].greySquare) makeMove(indeX, indeY);
				else if (boolCheckerSelected && !block[indeY][indeX].greySquare) {
					console.log("Unauthorized movement ");
					colorieCase(selectedPieceX, selectedPieceY, "#BA7A3A", false);
				} else {
					console.log("No checker selected ");
					colorieCase(selectedPieceX, selectedPieceY, "#BA7A3A", false);
				}
			} else {
				console.log(block[selectedPieceY][selectedPieceX].id);
				console.log("A checker is in mode attack, choose it");
			}

		} else {
			if (boolCheckerSelected && block[indeY][indeX].greySquare) makeMove(indeX, indeY);
			else if (boolCheckerSelected && !block[indeY][indeX].greySquare) {
				console.log("Unauthorized movement ");
				colorieCase(selectedPieceX, selectedPieceY, "#BA7A3A", false);
			} else {
				console.log("No checker selected");
			}
		}


	}
};

checker.prototype.setCoord = function(X,Y){
	const x = (this.coordX - 1) * moveLength;
	const y = (this.coordY - 1) * moveLength;
	this.id.style.top = y + 'px';
	this.id.style.left = x + 'px';
};


checker.prototype.checkIfKing = function () {

	if(this.coordY === 1 && !this.king && this.color === "white"){
		this.king = true;
        this.id.getElementsByTagName('img')[0].setAttribute("src", "double_dame_white.png");
		console.log("** checker modified to king **");
	}
	else if(this.coordY === 10 && !this.king && this.color === "black"){
		this.king = true;
        this.id.getElementsByTagName('img')[0].setAttribute("src", "double_dame_black.png");
		console.log("** checker modified to king **");
	}
};

/*===============Initialization all block =================================*/

let k = 1;
let i;
let j;
for (i = 1; i <=10; i++) {
	//Initialization of 2D array
	block[i]= [];
	for ( j = 1; j <= 10; j++) {
		//Filling block with all square
		block[i][j] = new square_p(square_class[k],j,i);
		k++;
	}
}

/*================Initialization checker =================================*/

	// white_checker
for (i = 1; i < 6; i++){
	w_checker[i] = new checker(white_checker_class[i], "white",2*i-1,10);
	w_checker[i].setCoord(2*i-1,10);
	block[10][w_checker[i].coordX].ocupied = true;
	block[10][w_checker[i].coordX].pieceId =i;
	block[10][w_checker[i].coordX].id = w_checker[i];
}

for (i = 6; i < 11; i++){
	w_checker[i] = new checker(white_checker_class[i], "white", 2*i-10,9);
	w_checker[i].setCoord(2*i,9);
	block[9][w_checker[i].coordX].ocupied = true;
	block[9][w_checker[i].coordX].pieceId = i;
	block[9][w_checker[i].coordX].id = w_checker[i];
}

for (i = 11; i < 16; i++){
	w_checker[i] = new checker(white_checker_class[i], "white",2*i-21, 8);
	w_checker[i].setCoord(2*i-1,8);
	block[8][w_checker[i].coordX].ocupied = true;
	block[8][w_checker[i].coordX].pieceId = i;
	block[8][w_checker[i].coordX].id = w_checker[i];
}

for (i = 16; i < 21; i++){
	w_checker[i] = new checker(white_checker_class[i], "white",2*i-30, 7);
	w_checker[i].setCoord(2*i,7);
	block[7][w_checker[i].coordX].id = w_checker[i];
	block[7][w_checker[i].coordX].ocupied = true;
	block[7][w_checker[i].coordX].pieceId = i;
}


//black_checker
for (i = 1; i <6; i++){
	b_checker[i] = new checker(black_checker_class[i], "black",2*i, 1);
	b_checker[i].setCoord(2*i-1,1);
	block[1][b_checker[i].coordX].id = b_checker[i];
	block[1][b_checker[i].coordX].ocupied = true;
	block[1][b_checker[i].coordX].pieceId = i + 100;

}

for (i = 6; i < 11; i++){
	b_checker[i] = new checker(black_checker_class[i], "black",2*i-11, 2);
	b_checker[i].setCoord(2*i,2);
	block[2][b_checker[i].coordX].id = b_checker[i];
	block[2][b_checker[i].coordX].ocupied = true;
	block[2][b_checker[i].coordX].pieceId = i + 100;
}

for (i = 11; i < 16; i++){
	b_checker[i] = new checker(black_checker_class[i], "black",2*i-20,3);
	b_checker[i].setCoord(2*i-1,3);
	block[3][b_checker[i].coordX].id = b_checker[i];
	block[3][b_checker[i].coordX].ocupied = true;
	block[3][b_checker[i].coordX].pieceId = i + 100;
}

for (i = 16; i < 21; i++) {
	b_checker[i] = new checker(black_checker_class[i], "black", 2 * i - 31, 4);
	b_checker[i].setCoord(2 * i, 4);
	block[4][b_checker[i].coordX].id = b_checker[i];
	block[4][b_checker[i].coordX].ocupied = true;
	block[4][b_checker[i].coordX].pieceId = i + 100;
}

/*==============Movements of checker=====================*/


// return the index of a square
function returnSquareIndex(x, y) {
	if (y === 1) return x;
	else if (y < 10) return (y - 1) * 10 + x;
	else if (y === 10 && x === 10) return 100;
	else return (y - 1) * 10 + x;

}


function Point(x,y) {
	this.x =x;
	this.y = y;

}



/**
 * @return {boolean}
 */
function LimitOfBoard(x, y) {
	return x <= 0 || x >= 11 || y <= 0 || y >= 11;
}

function colorieCase(valX, valY, couleur, bool) {
	let x = valX;
	let y = valY;
	while (!(x === 1)) {
		x--;
		y--;
		if (LimitOfBoard(x, y) || block[y][x].ocupied) break;
		block[y][x].id.style.background = couleur;
		block[y][x].greySquare = bool;
	}
	x = valX;
	y = valY;
	while (true) {
		x++;
		y++;
		if (LimitOfBoard(x, y) || block[y][x].ocupied) break;
		block[y][x].id.style.background = couleur;
		block[y][x].greySquare = bool;
	}
	x = valX;
	y = valY;
	while (true) {
		x--;
		y++;
		if (LimitOfBoard(x, y) || block[y][x].ocupied) break;
		block[y][x].id.style.background = couleur;
		block[y][x].greySquare = bool;
	}
	x = valX;
	y = valY;
	while (true) {
		x++;
		y--;
		if (LimitOfBoard(x, y) || block[y][x].ocupied) break;
		block[y][x].id.style.background = couleur;
		block[y][x].greySquare = bool;
	}
}

/** For a given checker we know if it can attack or do a simple movement
 *
 * @param depX
 * @param depY
 * @return 0  No possible movement
 * @return 1 simple movement allow
 * @return 2 can attack
 */
function checkAllDiagonal(depX, depY ) {
	let x= selectedPieceX +depX;
	let y = selectedPieceY +depY;

	if (!LimitOfBoard(x, y)) {
		if (block[y][x].ocupied &&( block[y][x].id.color !== block[selectedPieceY][selectedPieceX].id.color)) {

			x = x + depX;
			y = y + depY;
			if (!LimitOfBoard(x, y)) {
				if (block[y][x].ocupied === false && block[y-depY][x-depX].id.alive===true) {
					block[selectedPieceY][selectedPieceX].id.attack = true;
					currentlyAttack = true;
					block[y][x].id.style.background = "#685f5b";
					block[y][x].greySquare = true;
					if(listPossibleChecker.length=== 0){
						listPossibleChecker.push(new Point(x-depX,y-depY));
					}
					for(let point of listPossibleChecker){
						if (point.x !== x-depX && point.y !== y-depY){
							listPossibleChecker.push(new Point(x-depX,y-depY));
						}
					}
					return 2;

				}
			} return 0;

		}
		else if ((block[selectedPieceY][selectedPieceX].id.attack === false) ){
			if( !block[y][x].ocupied) {
				if (depY === -1 && block[selectedPieceY][selectedPieceX].id.color === "white") {
					block[y][x].id.style.background = "#685f5b";
					block[y][x].greySquare = true;
					return 1;
				} else if (depY === 1 && block[selectedPieceY][selectedPieceX].id.color === "black") {
					block[y][x].id.style.background = "#685f5b";
					block[y][x].greySquare = true;
					return 1;
				}
			}
		}

	}
	return 0;
}
//from a given list having Point, it delete them from the game
function DeleteChecker (list){
	var x ;
	var y;
	var i;
	let indexChecker;
	for(let point of list){
		x= point.x;
		y= point.y;
		block[y][x].ocupied = false;
		i = returnSquareIndex(x, y);
		if(block[y][x].pieceId < 100 ) {
			indexChecker =  block[y][x].pieceId;
			white_checker_class[indexChecker].style.visibility= 'hidden';
		}
		else {
			indexChecker =  block[y][x].pieceId -100;
			black_checker_class[indexChecker].style.visibility = 'hidden';
		}
		block[y][x] = new square_p(square_class[i], x, y);
	}
}

/** For a checker, verify all it's diagonals and return value according to all it's diagonals
 * @return 0 no movement allow
 * @retunr 1 simple movement allow
 * @return 2 attack is possible
 */
function MaxCheckDiagonals (){
	let valY = selectedPieceY;
	let valX = selectedPieceX;
	let a =0.0;
	let b =0.0;
	if (block[selectedPieceY][selectedPieceX].id.color === "white") {
		a =checkAllDiagonal(-1, 1);
		b = checkAllDiagonal(1, 1);
		a= Math.max(a,b);
		b= checkAllDiagonal(-1, -1);
		if (!LimitOfBoard(valX - 1, valY - 1) && block[valY - 1][valX - 1].ocupied === false) {
			block[valY - 1][valX - 1].id.style.background = "#BA7A3A";
			block[valY - 1][valX - 1].greySquare = false;
		}
		a= Math.max(a,b);
		b= checkAllDiagonal(1, -1);
		a = Math.max(a,b);
		b= checkAllDiagonal(-1, -1);
		return  Math.max(a,b);
	} else {
		a= checkAllDiagonal(-1, -1);
		b = checkAllDiagonal(1, -1);
		a = Math.max(a,b);
		b =checkAllDiagonal(-1, 1);
		if (!LimitOfBoard(valX - 1, valY + 1) && block[valY + 1][valX - 1].ocupied === false) {
			block[valY + 1][valX - 1].id.style.background = "#BA7A3A";
			block[valY + 1][valX - 1].greySquare = false;
		}
		a = Math.max(a,b);
		b =checkAllDiagonal(1, 1);
		a  =Math.max(a,b);
		b=checkAllDiagonal(-1, 1);
		return Math.max(a,b);
	}
}
//same thing as for a checker but for the king
function checkDiagKing(depX,depY){
	let x = selectedPieceX + depX;
	let y = selectedPieceY + depY;

	while(true)
	{
		if (LimitOfBoard(x, y)) return 0;
		if(block[y][x].ocupied){
			if(block[y][x].id.alive===true &&( block[y][x].id.color !== block[selectedPieceY][selectedPieceX].id.color) )
			{
				x =x + depX;
				y = y + depY;
				if(LimitOfBoard(x, y)) return 0;
				if(block[y][x].ocupied === false){
					if(listPossibleChecker.length=== 0){
						listPossibleChecker.push(new Point(x-depX,y-depY));
					}
					for(let point of listPossibleChecker){
						if (point.x !== x-depX && point.y !== y-depY){
							listPossibleChecker.push(new Point(x-depX,y-depY));
						}
					}
					while(true)
					{

						if(LimitOfBoard(x, y)) return 2;
						if (block[y][x].ocupied ) return 2;
						currentlyAttack = true;
						block[selectedPieceY][selectedPieceX].id.attack= true;
						block[y][x].id.style.background = "#685f5b";
						block[y][x].greySquare = true;
						x =x + depX;
						y = y + depY;
					}
				}


			}else return 0;

		}
		x =x + depX;
		y = y + depY;

	}

}
function kingMouvement() {
	let a,b,c,d;
	a =checkDiagKing(1,1);
	b =checkDiagKing(-1,1);
	c =checkDiagKing(-1,-1);
	d =checkDiagKing(1,-1);
	return Math.max(a,b,c,d);
}

//call function to draw path of possible movement
function showMoves(valX, valY) {

	canAttack = 0;

	selectedPieceX = valX;
	selectedPieceY = valY;
	let a =0;
	let b= 0;
	// Verify if the player can move this color
	if (me.color === block[selectedPieceY][selectedPieceX].id.color && me.turn === true) {
		if (block[selectedPieceY][selectedPieceX].id.king) { // is a king
			canAttack = kingMouvement();
			if(!currentlyAttack)
				colorieCase(valX, valY, "#685f5b", true);
			canAttack = 1;
		} else {// a checker
			canAttack = MaxCheckDiagonals (true);

		}
	}
}

//Change position of the selected checker to the new position
function makeMove(indexX,indexY) {
    //erase grey path
	colorieCase(selectedPieceX, selectedPieceY, "#BA7A3A", false);
	colorieCase(indexX, indexY, "#BA7A3A", false);
	block[indexY][indexX].id.style.background = "#BA7A3A";
	block[indexY][indexY].greySquare = false;
    //selected checker can attack
	if (block[selectedPieceY][selectedPieceX].id.attack === true){
		//add the take checker (dead) to the list of checker to delete
		for(let point of listPossibleChecker){
			if((point.x-indexX > 0) && (indexX >selectedPieceX)) {
				if((point.y - indexY > 0) && (indexY > selectedPieceY)){
					listDeadChecker.push(new Point(point.x,point.y));
					block[point.y][point.x].id.alive = false;

				}else{
					listDeadChecker.push(new Point(point.x,point.y));
					block[point.y][point.x].id.alive = false;

				}
			}else {
				if((point.y - indexY > 0 ) && (indexY > selectedPieceY)){
					listDeadChecker.push(new Point(point.x,point.y));
					block[point.y][point.x].id.alive = false;

				}else {
					listDeadChecker.push(new Point(point.x,point.y));
					block[point.y][point.x].id.alive = false;

				}
			}

		}
		listPossibleChecker = [];
	}


	let startBlock = block[selectedPieceY][selectedPieceX];
	const destinationBlock = block[indexY][indexX];
	let checkerIndex = startBlock.pieceId;



	//Update block at selected position
	startBlock.ocupied = false;
	let index_selected_square = returnSquareIndex(selectedPieceX, selectedPieceY);

	// update opponent board
	socket.emit('UpdateBoardMvt', {
		start_cordx: selectedPieceX,
		start_cordy: selectedPieceY,
		dest_x: indexX,
		dest_y: indexY,
		piece_id: block[selectedPieceY][selectedPieceX].pieceId,
		opponent: opponent
	});

    //From where the checker come we put the square that was there
	block[selectedPieceY][selectedPieceX] = new square_p(square_class[index_selected_square], selectedPieceX, selectedPieceY);


	//Update destination block and move the checker
	if (checkerIndex < 100) {
		w_checker[checkerIndex] = new checker(white_checker_class[checkerIndex], "white", indexX, indexY);
		w_checker[checkerIndex].setCoord(indexX, indexY);
		w_checker[checkerIndex].checkIfKing();
		block[indexY][indexX].id = w_checker[checkerIndex];

	}
	else {
		b_checker[checkerIndex - 100] = new checker(black_checker_class[checkerIndex - 100], "black", indexX, indexY);
		b_checker[checkerIndex - 100].setCoord(indexX, indexY);
		b_checker[checkerIndex - 100].checkIfKing();
		block[indexY][indexX].id = b_checker[checkerIndex - 100];

	}

	//Changement de valeur du bloc de destination
	block[indexY][indexX].ocupied = true;
	block[indexY][indexX].pieceId = checkerIndex;

    //Verification if the selected checker can still attack
	if (currentlyAttack){
		let tmpX = selectedPieceX;
		let tmpY = selectedPieceY;
		selectedPieceX = indexX;
		selectedPieceY = indexY;
		colorieCase(selectedPieceX, selectedPieceY, "#BA7A3A", false);
		if(block[tmpY][tmpY].id.king){
			canAttack = kingMouvement();
		}else{
			canAttack = MaxCheckDiagonals(true);
		}
		//if it cannot attack from new position we delete dead checker and pass turn
		if (canAttack !== 2){
			colorieCase(selectedPieceX, selectedPieceY, "#BA7A3A", false);
			colorieCase(tmpX, tmpY, "#BA7A3A", false);
			block[tmpY][tmpX].id.attack = false;
			currentlyAttack = false;
			DeleteChecker(listDeadChecker);
			for(let point of listDeadChecker){
				socket.emit('UpdapteBoardDelete', {
					coordX: point.x,
					coordY: point.y,
					opponentSocket: opponent.idSocket
				});
			}
			listDeadChecker = [];
			socket.emit('PassTurn', {
				me: me,
				opponent: opponent
			});
		}
	}else { // if it was a simple movement
		colorieCase(indexX, indexY, "#BA7A3A", false);
		DeleteChecker(listDeadChecker);
		block[selectedPieceY][selectedPieceX].id.attack= false;
		for(let point of listDeadChecker){
			socket.emit('UpdapteBoardDelete', {
				coordX: point.x,
				coordY: point.y,
				opponentSocket: opponent.idSocket
			});
		}
		listDeadChecker = [];
		currentlyAttack = false;
		socket.emit('PassTurn', {
			me: me,
			opponent: opponent
		});
	}


	selectedPieceY = 0;
	selectedPieceX = 0;
	boolCheckerSelected = false;
//	checkEndGame()
}

// Not developed yet
// function checkEndGame() {
// 	var nb_pions_blanc_vivant = 0;
// 	var nb_pions_noir_vivant = 0;
// 	//console.log("ICI{");
// 	for(var i in w_checker)
// 	{
// 		//console.log(w_checker[i]);
// 	}
// 	//console.log("}ICI");
// 	// PLUS DE PIECES D'UN JOUEUR
//
// 	// EGALITE SI LE MEME MOUVEMENT SE REPRODUIT 3 FOIS AVEC LE MEME JOUEUR AYANT LA MEME POSSIBILITE DE MOUVEMENT (PAS FORCEMENT CONSECUTIF)
//
// 	// EGALITE SI UN SEUL ROI CONTRE UN SEUL ROI
//
// 	// SI EN 25 MOUV, AUCUNE PIECE N'EST DEPLACEE OU MANGEE
//
// 	// SI COMBAT (3 ROI/2 ROI + 1 PIECE/1 ROI + 2 PIECE) CONTRE 1 ROI
// 	return false;
// }
//
// function victory(joueur_gagnant) {
// 	var nb_pions_blanc_vivant = 0;
// 	var nb_pions_noir_vivant = 0;
// 	for(var i in w_checker)
// 	{
// 		if(w_checker[i].alive == true){
// 			nb_pions_blanc_vivant++;
// 		}
// 	}
// 	console.log("ICI" + nb_pions_blanc_vivant);
// 	for(var i in b_checker)
// 	{
// 		if(b_checker[i].alive == true){
// 			nb_pions_noir_vivant++;
// 		}
// 	}
// 	console.log("ICI" + nb_pions_blanc_vivant);
// 	// PLUS DE PIECES D'UN JOUEUR
//
// 	// EGALITE SI LE MEME MOUVEMENT SE REPRODUIT 3 FOIS AVEC LE MEME JOUEUR AYANT LA MEME POSSIBILITE DE MOUVEMENT (PAS FORCEMENT CONSECUTIF)
//
// 	// EGALITE SI UN SEUL ROI CONTRE UN SEUL ROI
//
// 	// SI EN 25 MOUV, AUCUNE PIECE N'EST DEPLACEE OU MANGEE
//
// 	// SI COMBAT (3 ROI/2 ROI + 1 PIECE/1 ROI + 2 PIECE) CONTRE 1 ROI
// 	return false;
// }
