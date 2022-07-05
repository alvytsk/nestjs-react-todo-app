import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '~/state/todoSlice';

export type TodoAddFormProps = {
  loading: boolean;
};

const TodoAddForm = ({ loading }: TodoAddFormProps) => {
  const [title, setTitle] = useState<string>('');
  const dispatch = useDispatch();

  const onAddTodo = () => {
    if (!title) return;

    dispatch(
      addTodo({
        title: title
      })
    );

    setTitle('');
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      onAddTodo();
    }
  };

  return (
    <div className="add-todo-form">
      <input
        type="text"
        value={title}
        placeholder="Type todo"
        onKeyDown={onKeyDown}
        disabled={loading}
        onChange={(event) => setTitle(event.target.value)}
      />
      <button className="add-todo-btn" onClick={onAddTodo} disabled={loading || !title}>
        Add
      </button>
    </div>
  );
};

export default TodoAddForm;
