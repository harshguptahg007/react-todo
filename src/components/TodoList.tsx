import React, {useEffect} from 'react';
import {GlobalProps} from "../App";
import {inject, observer} from "mobx-react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TodoItem from './TodoItem/TodoItem';
import '../App.css';

interface Props extends GlobalProps {
}

const TodoList: React.FC<Props> = (props: Props) => {
    const store = props.store!.todo;

    useEffect(()=>{
        store.getData();
    },[store]);

    return (
        <div>
            <ReactCSSTransitionGroup
                transitionName="fade"
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}>
                {store.todosFiltered.map((todo) =>
                    <TodoItem
                        key={todo.id}
                        todo={todo}/>)
                }
            </ReactCSSTransitionGroup>
        </div>
    );
};

export default inject('store')(observer(TodoList));