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

var boolCheckerSelected = false;


/*================class declaration=========*/

//actif uniqument lorsqu'on appuie sur un pion
function showMoves(color, valX, valY,king,piece) {
	//Enregistrement des coordonnées de la pièces qu'on veut déplacer
	selectedPieceX = valX;
	selectedPieceY = valY;
	console.log("---------------------------------\n		SHOWMOVES");

	//Tout ce qui est en dessous ne fonctionne pas
	/*if(block[valY][valX].pieceId.id === piece)
	{
		selectedPiece = piece;
		selectedPieceX = valX;
		selectedPieceY = valY;
		console.log("yes");

	}
	if(king === true){ //est une dames

	}
	else{ //un pion normal
 		if(color === "white")
 		{
			if(valX === 10 && block[valX-1][valY-1].ocupied === false)
			{
				block[valY-1][valX-1].id.style.background = "#685f5b";

			}
 		}
		else
		{
			console.log("black");
		}
	}
*/

}

//class d'un pion
var checker = function (piece, color, valX, valY) {
	this.id = piece;
	this.color = color;
	this.king = false;
	this.alive = true;
	this.attack = false;

	this.coordX = valX;
	this.coordY = valY;

	//Actif uniquement lorsqu'on appuie sur un pion
	this.id.onclick = function  () {
		boolCheckerSelected = true;
		showMoves(color,valX,valY,this.king,piece);
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
function makeMove(indexX,indexY) {
	let index = block[selectedPieceY][selectedPieceX].pieceId;
	//affichage de débug
	if(index<100) console.log("BLANC");
	else console.log("NOIR");
	console.log("Piece selectionnee: X:" + selectedPieceX + " Y:" + selectedPieceY);
	console.log("Case destination: X:" + indexX + " Y:" + indexY);
	console.log("Bloc départ avant modif: \n Piece id: " + index + "\n Occupe: " + block[selectedPieceY][selectedPieceX].ocupied + "\n ID: " + block[selectedPieceY][selectedPieceX].id);


	//Changement de valeur du bloc où se trouvait la pièce avant le déplacement
	block[selectedPieceY][selectedPieceX].ocupied = false;
	let index_selected_square = returnSquareIndex(selectedPieceX, selectedPieceY);
	block[selectedPieceY][selectedPieceX] = new square_p(square_class[index_selected_square], selectedPieceX, selectedPieceY);

	//block[1][3].id.style.background = "#41BA3E";

	//Changement de valeur du bloc de destination en fonction de couleur pion
	if(index < 100){
		w_checker[index] = new checker(white_checker_class[index], "white", indexX, indexY);
		w_checker[index].setCoord(indexX, indexY);
		w_checker[index].checkIfKing();
		block[indexY][indexX].id = w_checker[index];
	}
	else{
		b_checker[index] = new checker(black_checker_class[index-100], "black", indexX, indexY);
		b_checker[index].setCoord(indexX, indexY);
		b_checker[index].checkIfKing();
		block[indexY][indexX].id = b_checker[index];
	}

	//Changement de valeur du bloc de destination
	block[indexY][indexX].ocupied = true;
	block[indexY][indexX].pieceId = index;

	//affichage de débug
	console.log("Bloc d'arrivee après modif: \n Piece id: " + block[indexY][indexX].pieceId + "\n Occupe: " + block[indexY][indexX].ocupied + "\n ID: " + block[indexY][indexX].id);
	console.log("Block départ apres modif: \n Piece id: " + block[selectedPieceY][selectedPieceX].pieceId + "\n Occupe: " + block[selectedPieceY][selectedPieceX].ocupied + "\n ID: " + block[selectedPieceY][selectedPieceX].id);
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
	this.id.onclick = function() {
		if(boolCheckerSelected) makeMove(indeX,indeY);
		else console.log("No checker selected before")
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
		this.id.style.border = "2px solid #000000"; // CHANGER STYLE TEMPORAIRE PAR IMAGE
		console.log("checker modified to king");
	}
	else if(this.coordY === 10 && !this.king && this.color === "black"){
		this.king = true;
		this.id.style.border = "2px solid #FFFFFF"; // CHANGER STYLE TEMPORAIRE PAR IMAGE
		console.log("checker modified to king");
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
	w_checker[i] = new checker(white_checker_class[i], "white",2*i-1,10);
	w_checker[i].setCoord(2*i-1,10);
	block[10][w_checker[i].coordX].ocupied = true;
	block[10][w_checker[i].coordX].pieceId =i;
	block[10][w_checker[i].coordX].id = w_checker[i];
}

for (i = 6; i < 11; i++){
	w_checker[i] = new checker(white_checker_class[i], "white", 2*i-10,9 );
	w_checker[i].setCoord(2*i,9);
	block[9][w_checker[i].coordX].ocupied = true;
	block[9][w_checker[i].coordX].pieceId = i;
	block[9][w_checker[i].coordX].id = w_checker[i];
}

for (i = 11; i < 16; i++){
	w_checker[i] = new checker(white_checker_class[i], "white",2*i-21,  8 );
	w_checker[i].setCoord(2*i-1,8);
	block[8][w_checker[i].coordX].ocupied = true;
	block[8][w_checker[i].coordX].pieceId = i;
	block[8][w_checker[i].coordX].id = w_checker[i];
}

for (i = 16; i < 21; i++){
	w_checker[i] = new checker(white_checker_class[i], "white",2*i-30,  7 );
	w_checker[i].setCoord(2*i,7);
	block[7][w_checker[i].coordX].id = w_checker[i];
	block[7][w_checker[i].coordX].ocupied = true;
	block[7][w_checker[i].coordX].pieceId = i;
}


//black_checker
for (i = 1; i <6; i++){
	b_checker[i] = new checker(black_checker_class[i], "black",2*i, 1 );
	b_checker[i].setCoord(2*i-1,1);
	block[1][b_checker[i].coordX].id = b_checker[i];
	block[1][b_checker[i].coordX].ocupied = true;
	block[1][b_checker[i].coordX].pieceId = i + 100;

}

for (i = 6; i < 11; i++){
	b_checker[i] = new checker(black_checker_class[i], "black",2*i-11,  2 );
	b_checker[i].setCoord(2*i,2);
	block[2][b_checker[i].coordX].id = b_checker[i];
	block[2][b_checker[i].coordX].ocupied = true;
	block[2][b_checker[i].coordX].pieceId = i + 100;
}

for (i = 11; i < 16; i++){
	b_checker[i] = new checker(black_checker_class[i], "black",2*i-20,3  );
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

/*
for(i = 1 ; i <101; i++){
	console.log(i);
	console.log(square_class[i].indeX);
}

for (i = 1 ; i< 11 ; i++){
	for (j=1 ; j<11; j++){
		//console.log(block[i][j].pieceId);
		//console.log(block[i][j].ocupied);
		console.log(block[i][j].id);
		console.log(returnSquareIndex(j,i));

	}

}
*/
