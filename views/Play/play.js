let me;
let opponent;

// socket when opponent moove
socket.on("UpdateAdversaireBoard", (res) => {
	block[res.start_cordy][res.start_cordx] = new square_p(square_class[returnSquareIndex(res.start_cordx, res.start_cordy)], res.start_cordx, res.start_cordy);

	console.log(me);
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
	console.log(res);
	if (res.challenged.idSocket == socket.id) {
		me = res.challenged;
		opponent = res.challenger;
	}
	else {
		me = res.challenger;
		opponent = res.challenged;
	}
});
