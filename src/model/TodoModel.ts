import {observable} from 'mobx';

export class TodoModel {

    @observable id!:string;
    @observable title!:string;
    @observable isComplete!:boolean;
    @observable isEditing!: boolean;
}