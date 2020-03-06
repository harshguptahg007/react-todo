import React from 'react';
import {GlobalProps} from "../../App";
import './TodosFiltered.css';
import {inject, observer} from "mobx-react";

interface Props extends GlobalProps {

}

const TodosFiltered:React.FC<Props> = (props: Props) => {
    const store = props.store!.todo;

    return (
        <div>
            <button
                className={store.filter === 'all' ? 'active' : ''}
                onClick={() => store.updateFilter('all')}>
                All
            </button>
            <button
                className={store.filter === 'active' ? 'active' : ''}
                onClick={() => store.updateFilter('active')}>
                Active
            </button>
            <button
                className={store.filter === 'completed' ? 'active' : ''}
                onClick={() => store.updateFilter('completed')}>
                Completed
            </button>
        </div>
    );
};

export default inject('store')(observer(TodosFiltered));