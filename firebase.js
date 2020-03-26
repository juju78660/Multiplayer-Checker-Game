require('dotenv').config();
module.exports = {
    getFirebaseConfig: function () {
        console.log("ICI" + process.env.FIREBASE_CONFIG);
        return process.env.FIREBASE_CONFIG;
    }
};
