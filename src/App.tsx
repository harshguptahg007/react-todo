import React from 'react';
import './App.css';
import TodoInput from './components/TodoInput/TodoInput';
import TodoCheckAll from './components/TodoCheckAll';
import TodoRemaining from './components/TodoRemaining';
import {RootStore} from "./stores/RootStore";
import {Provider} from "mobx-react";
import TodoList from "./components/TodoList";
import TodoFiltered from "./components/TodosFiltered/TodosFiltered";
import TodoClearCompleted from "./components/TodoClearCompleted";

export interface GlobalProps {
}

export interface GlobalProps {
  store?: RootStore;
}

const App = () => {
  return (
      <Provider store={RootStore.getInstance()}>
        <div className="App">
          <TodoInput/>
          <TodoList/>
          <div className="divider"></div>
          <div className="extra-container">
            <TodoCheckAll/>
            <TodoRemaining/>
          </div>
          <div className="divider"></div>
          <div className="extra-container">
            <TodoFiltered/>
            <TodoClearCompleted/>
          </div>
        </div>
      </Provider>
  );
};

export default App;
