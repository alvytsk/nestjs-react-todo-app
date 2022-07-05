import React from 'react';
import './app.scss';
import CompletedCounter from './CompletedCounter';
import TodoAddForm from './TodoAddForm';
import TodoList from './TodoList';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '~/state';
import { RootState } from '~/state';
import { fetchTodos } from '~/state/todoSlice';

const App = () => {
  const { completed, total, loading } = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch<AppDispatch>();

  const loadAllTodos = () => {
    dispatch(fetchTodos());
  };

  return (
    <section className="container">
      <div className="app-wrapper">
        <div className="app-title">Simple Todo App</div>
        <div className="header-form-wrapper">
          <TodoAddForm loading={loading} />
          <button className="load-todos-btn" onClick={loadAllTodos} disabled={loading}>
            Load todos
          </button>
        </div>
        <CompletedCounter total={total} completed={completed} />
        <TodoList />
      </div>
    </section>
  );
};

export default App;
