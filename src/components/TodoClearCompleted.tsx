import * as React from 'react';
import {GlobalProps} from "../App";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {inject, observer} from "mobx-react";

interface Props extends GlobalProps {
}

const TodoClearCompleted:React.FC<Props> = (props: Props) => {
    const store = props.store!.todo;

    return (
        <div>
            <ReactCSSTransitionGroup
                transitionName="fade"
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}
            >
                {store.todosCompletedCount > 0 &&
                <button
                    onClick={store.clearCompleted}>
                    Clear Completed
                </button>
                }
            </ReactCSSTransitionGroup>
        </div>
    );
};

export default inject('store')(observer(TodoClearCompleted));