import React, { useState, useEffect, useRef } from 'react';
import { deleteTodo, editTodo, toggleCompleted, TodoItem } from '~/state/todoSlice';
import { useAppDispatch } from '~/hooks/state';

const TodoItem = (item: TodoItem) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState<string>(item.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (focused) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [focused]);

  const onTodoDelete = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    dispatch(deleteTodo({ _id: item._id }));
  };

  const onLostFocus = (
    event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>
  ) => {
    if (focused) {
      setFocused(false);
      if (event.type === 'click') setEditMode(false);
      else
        setTimeout(() => {
          if (editMode) setEditMode(false);
        }, 150);
    }
  };

  const onTodoEdit = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    if (editMode) {
      onLostFocus(event);
      if (item.title !== value) {
        dispatch(
          editTodo({
            _id: item._id,
            title: value
          })
        );
      }
    } else {
      setFocused(true);
      setEditMode(true);
    }
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      onTodoEdit(event);
    }
  };

  const onTodoCompleted = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (item.completed !== event.target.checked) {
      dispatch(
        toggleCompleted({
          _id: item._id,
          completed: event.target.checked
        })
      );
    }

    checkboxRef.current?.blur();
  };

  const onItemClick = (
    event: React.MouseEvent<HTMLElement> & React.ChangeEvent<HTMLInputElement>
  ) => {
    /* Checkbox has its own handler */
    if (event.target.type === 'checkbox') return;
    if (editMode) return;

    dispatch(
      toggleCompleted({
        _id: item._id,
        completed: !checkboxRef.current?.checked
      })
    );
  };

  const completedAndNotEditing = (item: TodoItem) => item.completed && !editMode;

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
        <button onClick={onTodoEdit}>{editMode ? 'Done' : 'Edit'}</button>
        <button className="delete-btn" onClick={onTodoDelete}>
          x
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
