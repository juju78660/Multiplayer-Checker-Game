// id socket
// id user
// nom
// state (available or not)

class userObj {

    constructor(idSocket, idUser, username) {
        this.idSocket = idSocket;
        this.idUser = idUser;
        this.username = username;
        this.available = true;
        this.socketOpponent = null;
    }

    getIdSocket() {
        return this.idSocket;
    }

    getIdUser() {
        return this.idUser;
    }

    getUsername() {
        return this.username;
    }

    invite(opponent) {
        if (opponent == this){
             return false;
            }
        if (this.available != true || opponent.available != true) {
             return false;
            }
        this.available = false;
        opponent.available = false;
        return true;
    }

    //get state() {
    //    return this.state;
    //}
}

module.exports = {
    userObj
};
