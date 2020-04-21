# Multiplayers cheker game

Web app using Node Js and Express to play checker game in multiplayers

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

Add a file .env at the roor of the project with a variable FIREBASE_CONFIG with the api key

Run the web app
```
node app.js
```

Go to your localhost
```
http://localhost:3000/
```
