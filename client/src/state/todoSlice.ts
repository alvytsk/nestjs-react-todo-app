import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type TodoItem = {
  _id: number;
  title: string;
  completed: boolean;
};

export type TodoDto = {
  _id?: number;
  title?: string;
  completed?: boolean;
};

// const initialState: TodoItem[] = [
//   { id: 0, title: 'Drink coffee', completed: true },
//   { id: 1, title: 'Todo list coding', completed: true },
//   { id: 2, title: 'Check mail', completed: false }
// ];

type TodoState = {
  data: TodoItem[];
  loading: boolean;
  total: number;
  completed: number;
};

const initialState: TodoState = {
  data: [],
  loading: true,
  total: 0,
  completed: 0
};

export const fetchTodos = createAsyncThunk('todos/getAll', async () => {
  // const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const response = await fetch('http://localhost:3001/api/todos', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
});

const getIndex = (id: number, arr: TodoItem[]) => {
  return arr.findIndex((item) => item._id === id);
};

export const addTodo = createAsyncThunk('todos/addTodo', async (payload: TodoDto) => {
  const response = await fetch('http://localhost:3001/api/todos', {
    method: 'POST',
    body: JSON.stringify({ title: payload.title }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    return response.json();
  }
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (payload: TodoDto) => {
  const response = await fetch('http://localhost:3001/api/todos/' + payload._id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    return payload._id;
  }
});

export const editTodo = createAsyncThunk('todos/editTodo', async (payload: TodoDto) => {
  const response = await fetch('http://localhost:3001/api/todos/' + payload._id, {
    method: 'PUT',
    body: JSON.stringify({ title: payload.title }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    return { _id: payload._id, title: payload.title };
  }
});

export const toggleCompleted = createAsyncThunk(
  'todos/toggleCompleted',
  async (payload: TodoDto) => {
    const response = await fetch('http://localhost:3001/api/todos/' + payload._id, {
      method: 'PUT',
      body: JSON.stringify({ completed: payload.completed }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      return { _id: payload._id, completed: payload.completed };
    }
  }
);

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchTodos.pending.type]: (state: TodoState) => {
      state.data = [];
      state.loading = true;
    },
    [fetchTodos.fulfilled.type]: (state: TodoState, { payload }) => {
      state.data = payload.data;
      state.loading = false;
      state.total = state.data.length;
      state.completed = state.data.filter((item) => item.completed).length;
    },
    [fetchTodos.rejected.type]: (state: TodoState) => {
      state.loading = false;
    },

    [addTodo.pending.type]: (state: TodoState) => {
      state.loading = true;
    },
    [addTodo.fulfilled.type]: (state: TodoState, { payload }) => {
      state.loading = false;
      state.data.push(payload.data);
      state.total = state.data.length;
    },
    [addTodo.rejected.type]: (state: TodoState) => {
      state.loading = false;
    },

    [deleteTodo.pending.type]: (state: TodoState) => {
      state.loading = true;
    },
    [deleteTodo.fulfilled.type]: (state: TodoState, { payload }) => {
      state.loading = false;
      payload && state.data.splice(getIndex(payload, state.data), 1);
      state.total = state.data.length;
      state.completed = state.data.filter((item) => item.completed).length;
    },
    [deleteTodo.rejected.type]: (state: TodoState) => {
      state.loading = false;
    },

    [editTodo.pending.type]: (state: TodoState) => {
      state.loading = true;
    },
    [editTodo.fulfilled.type]: (state: TodoState, { payload }) => {
      state.loading = false;
      if (payload) {
        const { _id, title } = payload as { _id: number; title: string };
        state.data[getIndex(_id, state.data)].title = title;
      }
    },
    [editTodo.rejected.type]: (state: TodoState) => {
      state.loading = false;
    },

    [toggleCompleted.pending.type]: (state: TodoState) => {
      state.loading = true;
    },
    [toggleCompleted.fulfilled.type]: (state: TodoState, { payload }) => {
      state.loading = false;
      if (payload) {
        const { _id, completed } = payload as { _id: number; completed: boolean };
        state.data[getIndex(_id, state.data)].completed = completed;
        state.completed = state.data.filter((item) => item.completed).length;
      }
    },
    [toggleCompleted.rejected.type]: (state: TodoState) => {
      state.loading = false;
    }
  }
});

// export const {} = todoSlice.actions;

export default todoSlice.reducer;
