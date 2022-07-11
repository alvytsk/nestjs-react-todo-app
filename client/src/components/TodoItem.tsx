import React, { useState, useEffect, useRef } from 'react';
import { deleteTodo, editTodo, setCompleted, TodoItem } from '~/state/todoSlice';
import { useAppDispatch } from '~/hooks/state';

const TodoItem = (item: TodoItem) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editBtnTitle, setEditBtnTitle] = useState<string>('Edit');
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState<string>(item.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setEditBtnTitle(editMode ? 'Done' : 'Edit');
  }, [editMode]);

  React.useEffect(() => {
    if (focused) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [focused]);

  const onTodoDelete = (event) => {
    event.stopPropagation();
    dispatch(deleteTodo({ _id: item._id }));
  };

  const onTodoEdit = (event) => {
    event.stopPropagation();

    if (editMode) {
      setFocused(false);
      dispatch(
        editTodo({
          _id: item._id,
          title: value
        })
      );
    } else {
      setFocused(true);
    }

    setEditMode(!editMode);
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      onTodoEdit(event);
    }
  };

  const onLostFocus = (event) => {
    if (focused) {
      setFocused(false);
      setTimeout(() => {
        if (editMode) setEditMode(false);
      }, 50);
    }
  };

  const onTodoCompleted = (event) => {
    if (item.completed !== event.target.checked) {
      dispatch(
        setCompleted({
          id: item._id,
          completed: event.target.checked
        })
      );
    }

    checkboxRef.current?.blur();
  };

  const onItemClick = (event) => {
    /* Checkbox has its own handler */
    if (event.target.type === 'checkbox') return;
    if (editMode) return;

    dispatch(
      setCompleted({
        id: item._id,
        completed: !checkboxRef.current?.checked
      })
    );
  };

  const completedAndNotEditing = (item) => item.completed && !editMode;

  return (
    <div className="todo-item" onClick={onItemClick}>
      <input
        ref={checkboxRef}
        type="checkbox"
        checked={item.completed}
        onChange={onTodoCompleted}
      />
      <input
        type="text"
        ref={inputRef}
        value={value}
        style={{
          textDecoration: completedAndNotEditing(item) ? 'line-through' : 'none',
          opacity: completedAndNotEditing(item) ? '0.3' : '1'
        }}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onLostFocus}
        disabled={!editMode}
      />
      <div className="todo-btns-wrapper">
        <button onClick={onTodoEdit}>{editBtnTitle}</button>
        <button className="delete-btn" onClick={onTodoDelete}>
          x
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
