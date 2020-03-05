import * as React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {GlobalProps} from "../../App";
import './TodoItem.css';
import {TodoModel} from "../../model/TodoModel";
import {inject, observer} from "mobx-react";

interface Props extends GlobalProps {
    todo: TodoModel,
}

const todoItem = (props: Props) => {
    const store = props.store!.todo;
    return (
        <div className="todo-item" key={props.todo.id}>
            <input
                className="checkbox"
                type="checkbox"
                checked={props.todo.isComplete}
                onChange={() => store.checkTodo(props.todo)}
            />

            {!props.todo.isEditing &&
            <div
                className={"todo-item-label" }
                onDoubleClick={(event) => store.editTodo(props.todo)}
            >{props.todo.title}
            </div>
            }

            {props.todo.isEditing &&
            <input
                className="todo-item-edit"
                type="text"
                autoFocus
                defaultValue={props.todo.title}
                onBlur={(event) => store.doneEdit(props.todo,event)}
                onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                        store.doneEdit(props.todo, event);
                    } else if (event.key === 'Escape') {
                        store.cancelEdit(props.todo);
                    }
                }}
            />
            }
            <span className="remove-item">
                <FontAwesomeIcon
                    className="faicons"
                    icon={faTrash}
                    onClick={() => store.deleteTodo(props.todo.id)}
                />
            </span>
        </div>
    );
};

export default inject('store')(observer(todoItem));