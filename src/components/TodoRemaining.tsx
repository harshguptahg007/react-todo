import * as React from 'react';
import {GlobalProps} from "../App";
import {inject, observer} from "mobx-react";

interface Props extends GlobalProps {
}

const TodosRemaining:React.FC<Props> = (props: Props) => {
    const store = props.store!.todo;
    return (
        <div className="item-count">
            {store.remaining} items left
        </div>
    );
};

export default inject('store')(observer(TodosRemaining));