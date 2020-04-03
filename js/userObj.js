// id socket
// id user
// nom
// state (available or not)

class userObj {

    constructor(idSocket, idUser, username) {
        this.idSocket = idSocket;
        this.idUser = idUser;
        this.username = username;
        //this.state = state;
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

    //get state() {
    //    return this.state;
    //}
}

module.exports = {
    userObj
};