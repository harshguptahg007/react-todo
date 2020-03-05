import {observable} from 'mobx';

export class TodoModel {

    @observable id!:number;
    @observable title!:string;
    @observable isComplete!:boolean;
    @observable isEditing!: boolean;
}