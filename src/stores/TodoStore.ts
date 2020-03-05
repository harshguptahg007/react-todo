import {action, computed, observable} from "mobx";
import {TodoModel} from "../model/TodoModel";
import React from 'react';
import {todosRef} from "../firebase";

export class TodoStore {
    private static _instance: TodoStore;
    @observable todoList: TodoModel[];
    @observable idForNextTodo: number;
    @observable filter: string;
    @observable todoInput: any;
    @observable beforeEditCache: string;

    constructor() {
        this.todoList = [
            {
                id: 1,
                title: 'MOBX 1 data',
                isComplete: false,
                isEditing: false,
            },
            {
                id: 2,
                title: 'MOBX 2 data',
                isComplete: false,
                isEditing: false,
            },
        ];
        this.idForNextTodo = 3;
        this.filter = 'all';
        this.todoInput = React.createRef();
        this.beforeEditCache='';
    }

    static getInstance(): TodoStore {
        if (!this._instance) {
            this._instance = new TodoStore();
        }

        return this._instance;
    }

    @action fetchTodos = async () => {
        todosRef.on("value",snapshot => {
            console.log(snapshot);
        })
    };

    @action addTodo = async (event) => {
        if (event.key === 'Enter') {
            const todoInput = event.target.value;

            if (todoInput.trim().length === 0) {
                return;
            }

            const obj = new TodoModel();
            obj.id = this.idForNextTodo;
            obj.title = todoInput;
            obj.isComplete = false;
            obj.isEditing = false;

            await todosRef.push().set(obj);

            this.todoList.push(obj);

            this.idForNextTodo++;
            this.todoInput.current.value='';
        }
    };

    @action deleteTodo = async (id) => {
        const index = this.todoList.findIndex(item => item.id === id);

        // await todosRef.child(this.todoList[index]).remove();

        this.todoList.splice(index, 1);

    };

    @action checkTodo = (todo) => {
        const index = this.todoList.findIndex(item => item.id === todo.id);
        todo.isComplete = !todo.isComplete;

        this.todoList.splice(index, 1, todo);
    };

    @action checkAllTodos = (event) => {
        this.todoList.forEach((todo) => todo.isComplete = event.target.checked);
    };

    @computed get remaining() {
        return this.todoList.filter(todo => !todo.isComplete).length;
    }

    @computed get anyRemaining() {
        return this.remaining === 0;
    }

    @computed get todosCompletedCount() {
        return this.todoList.filter(todo => todo.isComplete).length;
    };

    @action clearCompleted = () => {
        this.todoList = this.todoList.filter(todo => !todo.isComplete);
    };

    @action updateFilter = (filter) => {
        this.filter = filter;
    };

    @computed get todosFiltered() {
        if (this.filter === 'all') {
            return this.todoList;
        } else if (this.filter === 'active') {
            return this.todoList.filter(todo => !todo.isComplete);
        } else if (this.filter === 'completed') {
            return this.todoList.filter(todo => todo.isComplete);
        }

        return this.todoList;
    };

    @action editTodo = (todo: TodoModel) => {
        const index = this.todoList.findIndex(item => item.id === todo.id);
        todo.isEditing = true;
        this.beforeEditCache = todo.title;

        this.todoList.splice(index, 1, todo);
    };

    @action doneEdit = (todo: TodoModel, event) => {
        const index = this.todoList.findIndex(item => item.id === todo.id);
        todo.isEditing = false;

        if (event.target.value.trim().length === 0) {
            todo.title = this.beforeEditCache;
        } else {
            todo.title = event.target.value;
        }

        this.todoList.splice(index, 1, todo);
    };

    @action cancelEdit = (todo: TodoModel) => {
        const index = this.todoList.findIndex(item => item.id === todo.id);
        todo.title = this.beforeEditCache;
        todo.isEditing = false;

        this.todoList.splice(index, 1, todo);
    };
}