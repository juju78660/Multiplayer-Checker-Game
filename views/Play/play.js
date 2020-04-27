let me;
let opponent;

// socket when opponent moove
socket.on("UpdateAdversaireBoard", (res) => {
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
	console.log(res);
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

document.getElementById('giveUpButton').addEventListener('click', function () {
	if (confirm("Etes-vous sûr de vouloir abandonner la partie?")) {
		document.getElementById('table').remove(); // EFFACE ECHEQUIER
		document.getElementById('giveUpButton').remove(); // EFFACE LE BOUTON ABANDON
		document.getElementById('nomUtilisateur-indicateurTour').innerHTML = "VOUS AVEZ PERDU LA PARTIE PAR ABANDON";
		setTimeout(redir,3000);
		socket.emit("GiveUpRequest", opponent.idSocket);
	} else {
		console.log("ANNULATION DEMANDE ABANDON");
	}
});

// end game by give up
socket.on("GiveUpRequest", function (res) {
	document.getElementById('table').remove(); // EFFACE ECHEQUIER
	document.getElementById('giveUpButton').remove(); // EFFACE LE BOUTON ABANDON
	document.getElementById('nomUtilisateur-indicateurTour').innerHTML = "VOUS AVEZ GAGNE LA PARTIE PAR ABANDON DE L'ADVERSAIRE";
	setTimeout(redir,3000);
	// AJOUTER CODE POUR FINIR LA PARTIE
});

function redir(){
    self.location.href="/main";
    console.log("REDIRECTION AUTO DANS 10 SEC");
}
