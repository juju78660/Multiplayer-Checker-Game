# Multiplayer Checker Game
Projet universitaire de création d'un site web permettant de jouer au jeu de dame en ligne.

## Technologies/Langages utilisés:  
* Node JS - Express/Routes (Routes permettant de gérer les interactions avec le site et rediriger l'utilisateur)  
* SocketIO (Communication client-serveur, id unique pour chaque utilisateur)  
* Firebase Authentication (Gestion des utilisateurs)  
* Cloud Firestore (Stockage des données)  
* PHP   
* JS  





## Installation

Install node JS
```
https://nodejs.org/en/download/package-manager/
```

Install express
```
https://expressjs.com/
```

## Run the App

Add the firebase dependencie
```
npm install --save firebase
```

Add env dependencie to hide the api key connection to firebase :
```
npm install dotenv
```

Add socket.io dependencie

```
npm install socket.io
```

Add nunjuck dependencie
```
npm install nunjuck
```

Add a file .env at the roor of the project with a variable FIREBASE_CONFIG with the api key

Run the web app
```
node app.js
```

Go to your localhost
```
http://localhost:3000/
```
