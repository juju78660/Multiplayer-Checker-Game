/*
	Ce qui fonctionne : déplacement des pions blancs uniquement
	Notation utile :
		_ l'axe des abscisses est : x ou i (selon le contexte peut-être faudrait garder une notation)
		_ l'axe des ordonnées est : y ou j
		bloc[1][2] va avoir pour coordonnée x = 2 , y = 1
		donc c'est pour accéder à un champs  bloc[y][x]
 */

const square_class = document.getElementsByClassName("square");
const white_checker_class = document.getElementsByClassName("white_checker");
const black_checker_class = document.getElementsByClassName("black_checker");
const table = document.getElementById("table");
//const black_background = document.getElementById("black_background");
const moveLength = 80;
let selectedPiece;
let selectedPieceX;
let selectedPieceY;
//let upRight, upLeft, downLeft, downRight;

const block = [];
const w_checker = [];
const b_checker = [];
//let the_checker;
//let oneMove;
//let anotherMove;
//const mustAttack = false;

let boolCheckerSelected = false;

function Point(x,y) {
	this.x =x;
	this.y = y;

}

/**
 * @return {boolean}
 */
function LimitOfBoard(x, y) {
	return x === 0 || x === 11 || y === 0 || y === 11;
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

function checkAllDiagonal(depX, depY ) {
	let x= selectedPieceX +depX;
	let y = selectedPieceY +depY;


	if (!LimitOfBoard(x, y)) {

		if (block[y][x].ocupied &&( block[y][x].id.color !== block[selectedPieceY][selectedPieceX].id.color)) {
			x = x + depX;
			y = y + depY;
			if (!LimitOfBoard(x, y) && block[y][x].ocupied === false) {
				block[selectedPieceY][selectedPieceX].id.attack = true;
				block[y][x].id.style.background = "#685f5b";
				block[y][x].greySquare = true;
			}
		}
		if((block[selectedPieceY][selectedPieceX].id.attack === false) && !block[y][x].ocupied) {
			if (depY === -1 && block[selectedPieceY][selectedPieceX].id.color === "white") {
				block[y][x].id.style.background = "#685f5b";
				block[y][x].greySquare = true;
			} else if (depY === 1 && block[selectedPieceY][selectedPieceX].id.color === "black") {
				block[y][x].id.style.background = "#685f5b";
				block[y][x].greySquare = true;
			}
		}
	}
}

//actif uniqument lorsqu'on appuie sur un pion
function showMoves(valX, valY) {
	//Enregistrement des coordonnées de la pièces qu'on veut déplacer
	selectedPieceX = valX;
	selectedPieceY = valY;
	console.log("---------------------------------\n		SHOWMOVES");


	if (block[selectedPieceY][selectedPieceX].id.king) { //est un roi
		colorieCase(valX, valY, "#685f5b", true);
	} else {//est un pion
			if(block[selectedPieceY][selectedPieceX].id.color === "white") {
				checkAllDiagonal(-1, 1);
				checkAllDiagonal(1, 1);
				checkAllDiagonal(-1, -1);
				if (!LimitOfBoard(valX-1, valY-1) && block[valY-1][valX-1].ocupied === false) {
					block[valY-1][valX-1].id.style.background = "#BA7A3A";
					block[valY-1][valX-1].greySquare = false;
				}
				checkAllDiagonal(1, -1);
				checkAllDiagonal(-1, -1);
			}
			else{
				checkAllDiagonal(-1, -1);
				checkAllDiagonal(1, -1);
				checkAllDiagonal(-1, 1);
				if (!LimitOfBoard(valX-1, valY+1) && block[valY+1][valX-1].ocupied === false) {
					block[valY+1][valX-1].id.style.background = "#BA7A3A";
					block[valY+1][valX-1].greySquare = false;
				}
				checkAllDiagonal(1, 1);
				checkAllDiagonal(-1, 1);
			}

	}

// TODO : régler problème de case crisés en trop, enregistrer dans liste le pion qu'on mange

}

//class d'un pion
var checker = function (piece, color, valX, valY, boolKing) {
	this.id = piece;
	this.color = color;
	this.king = boolKing;
	this.alive = true;
	this.attack = false;

	this.coordX = valX;
	this.coordY = valY;

	//Actif uniquement lorsqu'on appuie sur un pion
	this.id.onclick = function  () {
		boolCheckerSelected = true;
		showMoves(valX, valY);
	}
};

//les square sont dans un tableau à une dimension allant de 1 à 100
// Permet de récupérer l'indice du carré en fonction des coordonnées
function returnSquareIndex(x, y) {
	if (y === 1) return x;
	else if (y < 10) return (y - 1) * 10 + x;
	else if (y === 10 && x === 10) return 100;
	else return (y - 1) * 10 + x;

}

//Fait le déplacement, faut d'abord sélectionner un pion (blanc pour l'instant)
//Puis appuyer sur une case vide alors le pion se déplace
// LES PIONS NOIR DEMARRENT A L'INDICE 100 -> IL FAUT FAIRE checkerIndex-100 POUR ACCEDER A LA PIECE DANS LA TABLEAU DES PIONS
function makeMove(indexX,indexY) {
	block[selectedPieceY][selectedPieceY].id.attack = false;
	colorieCase(selectedPieceX, selectedPieceY, "#BA7A3A", false);
	let startBlock = block[selectedPieceY][selectedPieceX]; // BLOC DE DEPART
	const destinationBlock = block[indexY][indexX];           // BLOC D'ARRIVEE
	let checkerIndex = startBlock.pieceId;                  // INDEX DE LA PIECE D'ECHEC

	//affichage de débug
	if (checkerIndex < 100) console.log("BLANC");
	else console.log("NOIR");
	console.log("Piece selectionnee: X:" + selectedPieceX + " Y:" + selectedPieceY);
	console.log("Case destination: X:" + indexX + " Y:" + indexY);
	console.log("Bloc départ avant modif: \n Piece id: " + checkerIndex + "\n Occupe: " + startBlock.ocupied + "\n ID: " + startBlock.id);


	//Changement de valeur du bloc où se trouvait la pièce avant le déplacement
	startBlock.ocupied = false;
	let index_selected_square = returnSquareIndex(selectedPieceX, selectedPieceY);

	// update adversaire board
	socket.emit('UpdateBoard', {
		start_cordx: selectedPieceX,
		start_cordy: selectedPieceY,
		dest_x: indexX,
		dest_y: indexY,
		piece_id: block[selectedPieceY][selectedPieceX].pieceId
	});

	console.log(block[selectedPieceY][selectedPieceX]);
	block[selectedPieceY][selectedPieceX] = new square_p(square_class[index_selected_square], selectedPieceX, selectedPieceY);

	//block[1][3].id.style.background = "#41BA3E";

	//Changement de valeur du bloc de destination en fonction de couleur pion
	if (checkerIndex < 100) {
		w_checker[checkerIndex] = new checker(white_checker_class[checkerIndex], "white", indexX, indexY, w_checker[checkerIndex].king);
		w_checker[checkerIndex].setCoord(indexX, indexY);
		w_checker[checkerIndex].checkIfKing();
		block[indexY][indexX].id = w_checker[checkerIndex];

	}
	else {
		b_checker[checkerIndex - 100] = new checker(black_checker_class[checkerIndex - 100], "black", indexX, indexY, b_checker[checkerIndex - 100].king);
		b_checker[checkerIndex - 100].setCoord(indexX, indexY);
		b_checker[checkerIndex - 100].checkIfKing();
		block[indexY][indexX].id = b_checker[checkerIndex - 100];

	}

	//Changement de valeur du bloc de destination
	block[indexY][indexX].ocupied = true;
	block[indexY][indexX].pieceId = checkerIndex;

	//affichage de débug
	console.log("Bloc d'arrivee après modif: \n Piece id: " + destinationBlock.pieceId + "\n Occupe: " + destinationBlock.ocupied + "\n ID: " + destinationBlock.id);
	console.log("Block départ apres modif: \n Piece id: " + startBlock.pieceId + "\n Occupe: " + startBlock.ocupied + "\n ID: " + startBlock.id);
	console.log("		MAKEMOVE\n---------------------------------");


	selectedPieceY = 0;
	selectedPieceX = 0;
	boolCheckerSelected = false;

}
//Classe de création des carrés
//voir plus bas comment est utilisé
var square_p = function (square, indeX, indeY) {
	this.id = square;
	this.ocupied = false;
	this.pieceId = undefined;
	this.greySquare = false;
	this.id.onclick = function () {

		if (boolCheckerSelected && block[indeY][indeX].greySquare) makeMove(indeX, indeY);
		else {
			console.log("No checker selected before");
			colorieCase(selectedPieceX, selectedPieceY, "#BA7A3A", false);
		}
	}
};

checker.prototype.setCoord = function(X,Y){
	const x = (this.coordX - 1) * moveLength;
	const y = (this.coordY - 1) * moveLength;
	this.id.style.top = y + 'px';
	this.id.style.left = x + 'px';
};
//non utilisé
checker.prototype.changeCoord = function(X,Y){
	this.coordY +=Y;
	this.coordX += X;
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
//non utilisé
const player_1 = function(id_player) {
	this.id = id_player;
	this.checker = w_checker;

};
//non utilisé
const  player_2 = function(id_player) {
	this.id = id_player;
	this.checker = b_checker;
};

/*===============Initialisation all block =================================*/

let k = 1;
var i;
var j;
for (i = 1; i <=10; i++) {
	//création du tableau à deux dimensions
	block[i]= [];
	for ( j = 1; j <= 10; j++) {
		//initialisation du bloc avec un carré blanc ou noir selon K
		block[i][j] = new square_p(square_class[k],j,i);
		k++;
	}
}
	/*==================================================*/


/*================Initialisation checker =================================*/

	// white_checker
for (i = 1; i < 6; i++){
	w_checker[i] = new checker(white_checker_class[i], "white",2*i-1,10, false);
	w_checker[i].setCoord(2*i-1,10);
	block[10][w_checker[i].coordX].ocupied = true;
	block[10][w_checker[i].coordX].pieceId =i;
	block[10][w_checker[i].coordX].id = w_checker[i];
}

for (i = 6; i < 11; i++){
	w_checker[i] = new checker(white_checker_class[i], "white", 2*i-10,9, false);
	w_checker[i].setCoord(2*i,9);
	block[9][w_checker[i].coordX].ocupied = true;
	block[9][w_checker[i].coordX].pieceId = i;
	block[9][w_checker[i].coordX].id = w_checker[i];
}

for (i = 11; i < 16; i++){
	w_checker[i] = new checker(white_checker_class[i], "white",2*i-21, 8, false);
	w_checker[i].setCoord(2*i-1,8);
	block[8][w_checker[i].coordX].ocupied = true;
	block[8][w_checker[i].coordX].pieceId = i;
	block[8][w_checker[i].coordX].id = w_checker[i];
}

for (i = 16; i < 21; i++){
	w_checker[i] = new checker(white_checker_class[i], "white",2*i-30, 7, false);
	w_checker[i].setCoord(2*i,7);
	block[7][w_checker[i].coordX].id = w_checker[i];
	block[7][w_checker[i].coordX].ocupied = true;
	block[7][w_checker[i].coordX].pieceId = i;
}


//black_checker
for (i = 1; i <6; i++){
	b_checker[i] = new checker(black_checker_class[i], "black",2*i, 1, false);
	b_checker[i].setCoord(2*i-1,1);
	block[1][b_checker[i].coordX].id = b_checker[i];
	block[1][b_checker[i].coordX].ocupied = true;
	block[1][b_checker[i].coordX].pieceId = i + 100;

}

for (i = 6; i < 11; i++){
	b_checker[i] = new checker(black_checker_class[i], "black",2*i-11, 2, false);
	b_checker[i].setCoord(2*i,2);
	block[2][b_checker[i].coordX].id = b_checker[i];
	block[2][b_checker[i].coordX].ocupied = true;
	block[2][b_checker[i].coordX].pieceId = i + 100;
}

for (i = 11; i < 16; i++){
	b_checker[i] = new checker(black_checker_class[i], "black",2*i-20,3, false);
	b_checker[i].setCoord(2*i-1,3);
	block[3][b_checker[i].coordX].id = b_checker[i];
	block[3][b_checker[i].coordX].ocupied = true;
	block[3][b_checker[i].coordX].pieceId = i + 100;
}

for (i = 16; i < 21; i++) {
	b_checker[i] = new checker(black_checker_class[i], "black", 2 * i - 31, 4, false);
	b_checker[i].setCoord(2 * i, 4);
	block[4][b_checker[i].coordX].id = b_checker[i];
	block[4][b_checker[i].coordX].ocupied = true;
	block[4][b_checker[i].coordX].pieceId = i + 100;
}


/*
for (i = 1 ; i< 11 ; i++){

	for(i = 1 ; i <10; i++){
		console.log(i);
		console.log(block[6][i].id.style.background);
		console.log(block[6][i].greySquare);
	}
    for (j=1 ; j<11; j++){

        console.log(block[i][j].id);
        console.log(block[i][j].id.style.background);
        //console.log(returnSquareIndex(j,i));

    }

}
*/
//console.log(square_class[i].indeX);
//console.log(block[i][j].pieceId);
//console.log(block[i][j].ocupied);
