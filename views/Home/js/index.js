var firebaseConfig =
{   
    apiKey: "AIzaSyB-h0fhhciH-F2z9JUp_bbn4QcDzR2zhSo",
    authDomain: "dames-14e44.firebaseapp.com",
    databaseURL: "https://dames-14e44.firebaseio.com",
    projectId: "dames-14e44",
    storageBucket: "dames-14e44.appspot.com",
    messagingSenderId: "593473240019",
    appId: "1:593473240019:web:8a81b758a93a7e08ce8d26",
    measurementId: "G-HP3VF4RGTK"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  $("#btn_logout").click(function()
  {
    firebase.auth().signOut();
  });