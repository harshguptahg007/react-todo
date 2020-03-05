import {action, computed, observable, runInAction} from "mobx";
import {TodoModel} from "../model/TodoModel";
import React from 'react';
import {addTodo,deleteTodo,updateTodo,getFirebaseTodos} from '../firebase';

export class TodoStore {
    private static _instance: TodoStore;
    @observable todoList: TodoModel[];
    @observable filter: string;
    @observable todoInput: any;
    @observable isLoading: boolean;
    @observable beforeEditCache: string;

    constructor() {
        this.todoList = [];
        this.filter = 'all';
        this.todoInput = React.createRef();
        this.beforeEditCache='';
        this.isLoading = false;
    }

    static getInstance(): TodoStore {
        if (!this._instance) {
            this._instance = new TodoStore();
        }

        return this._instance;
    }

    @action addTodo = async (event: any) => {
        if (event.key === 'Enter') {
            const todoInput = event.target.value;

            if (todoInput.trim().length === 0) {
                return;
            }

            let obj = new TodoModel();
            obj.title = todoInput;
            obj.isComplete = false;
            obj.isEditing = false;

            obj = await addTodo(obj);
            this.todoList.push(obj);
            this.todoInput.current.value='';
        }
    };

    @action deleteTodo = async (id: string) => {
        const index = this.todoList.findIndex(item => item.id === id);
        await deleteTodo(id);
        this.todoList.splice(index, 1);

    };

    @action checkTodo = async (todo: TodoModel) => {
        const index = this.todoList.findIndex(item => item.id === todo.id);
        todo.isComplete = !todo.isComplete;
        await updateTodo(todo);
        this.todoList.splice(index, 1, todo);
    };

    @action checkAllTodos = (event: any) => {
        this.todoList.forEach((todo) => {
            todo.isComplete = event.target.checked;
            updateTodo(todo);
        });
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

    @action updateFilter = (filter: string) => {
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

    @action doneEdit = async (todo: TodoModel, event: any) => {
        const index = this.todoList.findIndex(item => item.id === todo.id);
        todo.isEditing = false;

        if (event.target.value.trim().length === 0) {
            todo.title = this.beforeEditCache;
        } else {
            todo.title = event.target.value;
        }
        await updateTodo(todo);
        this.todoList.splice(index, 1, todo);
    };

    @action cancelEdit = (todo: TodoModel) => {
        const index = this.todoList.findIndex(item => item.id === todo.id);
        todo.title = this.beforeEditCache;
        todo.isEditing = false;

        this.todoList.splice(index, 1, todo);
    };

    @action async getData() {
        this.isLoading = true;
        let todoData: TodoModel[];
        await getFirebaseTodos().then((data)=>{
            todoData = data;
            runInAction(()=>{
                this.isLoading = false;
                this.todoList = todoData;
            });
        });
    }
}