// List contenant tous les utilisateur

class Users {
    
    constructor () {
        this.users = [];
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
    removeUser(idUser) {
        let user = this.getUserById(idUser);

        if (user) {
            this.users = this.users.filter((user) => user.getIdUser() !== idUser);
        }
        return user;
    }

    getUsers() {
        return this.users;
    }
}

module.exports = { Users };