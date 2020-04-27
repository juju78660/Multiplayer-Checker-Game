// List contenant tous les utilisateur

class Users {

    constructor () {
        this.users = [];
        this.usersWithoutSocket = [];
    }

    // Verifier si deja present
    addUser(userObj) {
        this.users.push(userObj);
    }

    getUserById(id) {
        return this.users.filter((user) => user.getIdUser() === id)[0];
    }


    getUserBySocket(id) {
        return this.users.filter((user) => user.getIdSocket() === id)[0];
    }

    /**
     *
     * @param {String} id
     * @returns Users removed
     */
    removeUser(idSocket) {
        let user = this.getUserBySocket(idSocket);

        if (user) {
            this.users = this.users.filter((user) => user.idSocket !== idSocket);
        }
        return user;
    }

    endBattle(currentSocketId, opponentSocketId) {

      console.log(opponentSocketId);
      console.log(currentSocketId);

      // Change available and empty their socketId
      this.getUserBySocket(currentSocketId).available = true;
      this.usersWithoutSocket.push(this.getUserBySocket(currentSocketId));
      this.getUserBySocket(currentSocketId).idSocket = null;

      this.getUserBySocket(opponentSocketId).available = true;
      this.usersWithoutSocket.push(this.getUserBySocket(opponentSocketId));
      this.getUserBySocket(opponentSocketId).idSocket = null;
    }

    // fill the 2 empty socket id
    updateIdAfterBattle(socketId) {
      // modifier 1 des 2 avec la nouvelle socket
      let user = this.usersWithoutSocket.shift();
      user.idSocket = socketId;
      return user;
    }

    getUsers() {
        return this.users;
    }
}

module.exports = { Users };
