import {observable} from "mobx";
import {TodoStore} from './TodoStore';

export class RootStore {
    private static _instance: RootStore;
    @observable todo: TodoStore;

    constructor() {
        this.todo = TodoStore.getInstance();
    }

    static getInstance(): RootStore {
        if (!this._instance) {
            this._instance = new RootStore();
        }

        return this._instance;
    }
}