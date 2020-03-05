import React, {useEffect} from 'react';
import {GlobalProps} from "../App";
import {inject, observer} from "mobx-react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TodoItem from './TodoItem/TodoItem';
import '../App.css';
import {CircularIndeterminate} from "./ProgressLoader"

interface TodoListPops extends GlobalProps {
}

const TodoList: React.FC<TodoListPops> = (props: TodoListPops) => {
    const store = props.store!.todo;

    useEffect(() => {
        store.getData();
    }, []);


    return (
        <div>
            {store.isLoading ?
                <div className="Center-container"><CircularIndeterminate/></div> :

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
            }1
        </div>
    );
};

export default inject('store')(observer(TodoList));