import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBA-8qlJSdfv424gp8BYx0nGy7C3vwhUSY",
    authDomain: "react-todo-ts.firebaseapp.com",
    databaseURL: "https://react-todo-ts.firebaseio.com",
    projectId: "react-todo-ts",
    storageBucket: "react-todo-ts.appspot.com",
    messagingSenderId: "157647774148",
    // appId: "1:157647774148:web:6bda8fc98d417c4e2bc491"
};

firebase.initializeApp(config);
const databaseRef = firebase.database().ref();



export const todosRef = databaseRef.child("todos");