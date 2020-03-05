import * as React from 'react';
import {GlobalProps} from "../App";
import {inject, observer} from "mobx-react";

interface Props extends GlobalProps {
}

const TodoCheckAll:React.FC<Props> = (props: Props) => {
    const store = props.store!.todo;
    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={store.anyRemaining}
                    onChange={store.checkAllTodos}
                /> Check All
            </label>
        </div>
    );
};

export default inject('store')(observer(TodoCheckAll));