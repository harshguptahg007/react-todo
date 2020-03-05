import * as firebase from 'firebase';
import {TodoModel} from "./model/TodoModel";

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
const todosRef = databaseRef.child("todos");

const addTodo = async (data: TodoModel) => {
    const newRef = todosRef.push();
    if (newRef.key) {
        data.id = newRef.key;
    } else {
        data.id = 'undefined';
    }
    await newRef.set(data);
    return data;
};

const deleteTodo = async (id: string) => {
    await todosRef.child(id).remove();
};

const updateTodo = async (todo: TodoModel) => {
    const newRef = todosRef.child(todo.id);
    console.log(newRef.toString());
    await newRef.set(todo);
};

async function getFirebaseTodos(): Promise<TodoModel[]> {
    const todoList: TodoModel[] = [];
    const snapshot = await todosRef.once('value');
    let todos = snapshot.val();
    for (let todo in todos) {
        todoList.push(todos[todo]);
    }
    return todoList;
}

export {addTodo, deleteTodo, updateTodo,getFirebaseTodos};