let me;
let opponent;

// socket when opponent moove
socket.on("UpdateBoardMouvement", (res) => {
	block[res.start_cordy][res.start_cordx] = new square_p(square_class[returnSquareIndex(res.start_cordx, res.start_cordy)], res.start_cordx, res.start_cordy);

	//console.log(me);
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

	//Changement de valeur du bloc de destination
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
	if(me.turn) document.getElementById('nomUtilisateur-indicateurTour').innerHTML = me.username + " - C'est votre tour!";
	else document.getElementById('nomUtilisateur-indicateurTour').innerHTML = me.username + " - C'est au tour de l'ennemi!";
});


socket.on('UpdapteBoardDelete', (res) => {
	block[res.coordY][res.coordX].ocupied = false;
	let i = returnSquareIndex(res.coordX, res.coordY);
	console.log("bonjour ############");
	if(block[res.coordY][res.coordX].pieceId < 100 ) {
		console.log("pion blanc");
		let indexChecker =  block[res.coordY][res.coordX].pieceId;
		white_checker_class[indexChecker].style.visibility= 'hidden';
	}
	else {
		console.log("pion noir");
		console.log(block[res.coordY][res.coordX].id);
		let indexChecker =  block[res.coordY][res.coordX].pieceId -100;
		black_checker_class[indexChecker].style.visibility = 'hidden';
	}

	block[res.coordY][res.coordX] = new square_p(square_class[i], res.coordX, res.coordY);
});