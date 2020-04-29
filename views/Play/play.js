let me;
let opponent;

// socket when opponent moove
socket.on("UpdateBoardMvt", (res) => {
	block[res.start_cordy][res.start_cordx] = new square_p(square_class[returnSquareIndex(res.start_cordx, res.start_cordy)], res.start_cordx, res.start_cordy);

	if (res.piece_id < 100) {
		w_checker[res.piece_id] = new checker(white_checker_class[res.piece_id], "white", res.dest_x, res.dest_y, w_checker[res.piece_id].king);
		w_checker[res.piece_id].setCoord(res.dest_x, res.dest_y);
		w_checker[res.piece_id].checkIfKing();
		block[res.dest_y][res.dest_x].id = w_checker[res.piece_id];

	}
	else {
		b_checker[res.piece_id - 100] = new checker(black_checker_class[res.piece_id - 100], "black", res.dest_x, res.dest_y, b_checker[res.piece_id - 100].king);
		b_checker[res.piece_id - 100].setCoord(res.dest_x, res.dest_y);
		b_checker[res.piece_id - 100].checkIfKing();
		block[res.dest_y][res.dest_x].id = b_checker[res.piece_id - 100];

	}

	//Update destination block
	block[res.dest_y][res.dest_x].ocupied = true;
	block[res.dest_y][res.dest_x].pieceId = res.piece_id;

});

// recover both user
socket.on("UpdateBattle", function (res) {
	if (res.challenged.idSocket == socket.id) {
		me = res.challenged;
		opponent = res.challenger;
	}
	else {
		me = res.challenger;
		opponent = res.challenged;
	}
	if(me.turn) document.getElementById('nomUtilisateur-indicateurTour').innerHTML = me.username + " - Your turn !";
	else document.getElementById('nomUtilisateur-indicateurTour').innerHTML = me.username + " - Opponent's turn !";
});

document.getElementById('giveUpButton').addEventListener('click', function () {
	if (confirm("Are you sure you want to give up ?")) {
		document.getElementById('table').remove();
		document.getElementById('giveUpButton').remove();
		document.getElementById('nomUtilisateur-indicateurTour').innerHTML = me.username +  " YOU LOST THE GAME BY ABANDONMENT";
		setTimeout(redir,3000);
		socket.emit("GiveUpRequest", me, opponent);
	} else {
		console.log("CANCEL GIVE UP REQUEST");
	}
});

// end game by give up
socket.on("GiveUpRequest", function (res) {
	//cleanup before exit
	document.getElementById('table').remove();
	document.getElementById('giveUpButton').remove();

	document.getElementById('nomUtilisateur-indicateurTour').innerHTML = me.username + " YOUR OPPENENT GIVE UP, YOU WON !";
	setTimeout(redir,3000);
});

socket.on("EndGame", function (res) {
	//cleanup before exit
	document.getElementById('table').remove();
	document.getElementById('giveUpButton').remove();
	if(res.winner.idSocket == socket.id){
		document.getElementById('nomUtilisateur-indicateurTour').innerHTML = me.username + " YOU WON !";
	}
	else{
		document.getElementById('nomUtilisateur-indicateurTour').innerHTML = me.username + " YOU LOOSE !";
	}
	setTimeout(redir,3000);
});

function redir(){
	self.location.href="/main";
	console.log("REDIRECTION AUTO DANS 3 SEC");
}

//socket to delete dead checker on the opponent side
socket.on('UpdapteBoardDelete', (res) => {
	block[res.coordY][res.coordX].ocupied = false;
	let i = returnSquareIndex(res.coordX, res.coordY);
	if(block[res.coordY][res.coordX].pieceId < 100 ) {
		let indexChecker =  block[res.coordY][res.coordX].pieceId;
		white_checker_class[indexChecker].style.visibility= 'hidden';
	}
	else {
		let indexChecker =  block[res.coordY][res.coordX].pieceId -100;
		black_checker_class[indexChecker].style.visibility = 'hidden';
	}

	block[res.coordY][res.coordX] = new square_p(square_class[i], res.coordX, res.coordY);
});
