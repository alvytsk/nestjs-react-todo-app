import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '~/state';
import TodoItem from './TodoItem';
import { fetchTodos } from '~/state/todoSlice';
import { AppDispatch } from '~/state';
import Spinner from './Spinner';

const TodoList = () => {
  const todos = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setTimeout(() => {
      dispatch(fetchTodos());
    }, 1500);
  }, [dispatch]);

  return (
    <div className="todo-list">
      {todos.loading && (
        <div className="spinner-wrapper">
          <Spinner />
        </div>
      )}
      {todos.data.map((item) => (
        <TodoItem key={item.id} {...item} />
      ))}
    </div>
  );
};

export default TodoList;
