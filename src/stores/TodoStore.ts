import {action, computed, observable, runInAction} from "mobx";
import {TodoModel} from "../model/TodoModel";
import React from 'react';

export class TodoStore {
    private static _instance: TodoStore;
    @observable todoList: TodoModel[];
    @observable idForNextTodo: number;
    @observable filter: string;
    @observable todoInput: any;
    @observable beforeEditCache: string;
    @observable isLoading: boolean;

    constructor() {
        this.todoList = [];
        this.idForNextTodo = 1;
        this.filter = 'all';
        this.todoInput = React.createRef();
        this.beforeEditCache = '';
        this.isLoading = false;
    }

    static getInstance(): TodoStore {
        if (!this._instance) {
            this._instance = new TodoStore();
        }

        return this._instance;
    }

    @action addTodo = async (event) => {
        if (event.key === 'Enter') {
            const todoInput = event.target.value;

            if (todoInput.trim().length === 0) {
                return;
            }

            const obj = new TodoModel();
            obj.id = this.idForNextTodo.toString();
            obj.title = todoInput;
            obj.isComplete = false;
            obj.isEditing = false;

            let idList = await localStorage.getItem('ids');
            if (idList) {
                idList = JSON.parse(idList);
                idList = idList!.toString();
                idList += obj.id;
            } else {
                idList = obj.id;
            }
            await localStorage.setItem('ids', JSON.stringify(idList));
            await localStorage.setItem(obj.id, JSON.stringify(obj));
            this.todoList.push(obj);
            this.idForNextTodo++;
            this.todoInput.current.value = '';
        }
    };

    @action deleteTodo = async (id) => {
        const index = this.todoList.findIndex(item => item.id === id);
        await localStorage.removeItem(id);
        this.todoList.splice(index, 1);

    };

    @action checkTodo = async (todo) => {
        const index = this.todoList.findIndex(item => item.id === todo.id);
        todo.isComplete = !todo.isComplete;
        await localStorage.setItem(todo.id, JSON.stringify(todo));
        this.todoList.splice(index, 1, todo);
    };

    @action checkAllTodos = (event) => {
        this.todoList.forEach((todo) => {
            todo.isComplete = event.target.checked;
            localStorage.setItem(todo.id, JSON.stringify(todo));
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

    @action clearCompleted = async () => {
        this.todoList = this.todoList.filter(todo => {
            localStorage.removeItem(!todo.isComplete ? todo.id : '');
            return !todo.isComplete;
        });
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

    @action doneEdit = async (todo: TodoModel, event) => {
        const index = this.todoList.findIndex(item => item.id === todo.id);
        todo.isEditing = false;

        if (event.target.value.trim().length === 0) {
            todo.title = this.beforeEditCache;
        } else {
            todo.title = event.target.value;
        }
        await localStorage.setItem(todo.id, JSON.stringify(todo));
        this.todoList.splice(index, 1, todo);
    };

    @action cancelEdit = (todo: TodoModel) => {
        const index = this.todoList.findIndex(item => item.id === todo.id);
        todo.title = this.beforeEditCache;
        todo.isEditing = false;

        this.todoList.splice(index, 1, todo);
    };

    @action
    async getData() {
        this.isLoading = true;
        let todoData: TodoModel[] = [];
        let idList = await localStorage.getItem('ids');
        if (idList) {
            idList = JSON.parse(idList);
            for (let i = 0; i < idList!.length; i++) {
                const todo = await localStorage.getItem(idList!.charAt(i));
                if (todo) {

                    todoData.push(JSON.parse(todo));
                }
            }
            runInAction(() => {
                this.isLoading = false;
                this.todoList = todoData;
            });
        }
    }
}