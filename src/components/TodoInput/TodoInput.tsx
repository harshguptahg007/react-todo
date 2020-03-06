import React from 'react';
import './TodoInput.css';
import {GlobalProps} from "../../App";
import {inject, observer} from "mobx-react";

interface Props extends GlobalProps {
}

const TodoInput: React.FC<Props>  = (props: Props)=> {
    const store = props.store!.todo;
    return (
        <input
            className="todoInput"
            type="text"
            placeholder="What needs to be done"
            ref={store.todoInput}
            onKeyUp={store.addTodo}
        />
    );
};

export default inject('store')(observer(TodoInput));