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

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    // editTodo: (state, { payload }) => {
    //   state.data[getIndex(payload.id, state.data)].title = payload.title;
    // },
    setCompleted: (state, { payload }) => {
      const { completed } = payload;
      state.data[getIndex(payload.id, state.data)].completed = completed;
      completed ? state.completed++ : state.completed--;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.pending, (state: TodoState) => {
      state.data = [];
      state.loading = true;
    });
    builder.addCase(fetchTodos.fulfilled, (state: TodoState, { payload }) => {
      state.data = payload.data;
      state.loading = false;
      state.total = state.data.length;
      // state.completed = state.data.filter((item) => item.completed).length;
    });
    builder.addCase(fetchTodos.rejected, (state: TodoState) => {
      state.loading = false;
    });

    builder.addCase(addTodo.pending, (state: TodoState) => {
      state.loading = true;
    });
    builder.addCase(addTodo.fulfilled, (state: TodoState, { payload }) => {
      state.loading = false;
      state.data.push(payload.data);
    });
    builder.addCase(addTodo.rejected, (state: TodoState) => {
      state.loading = false;
    });

    builder.addCase(deleteTodo.pending, (state: TodoState) => {
      state.loading = true;
    });
    builder.addCase(deleteTodo.fulfilled, (state: TodoState, { payload }) => {
      state.loading = false;
      payload && state.data.splice(getIndex(payload, state.data), 1);
    });
    builder.addCase(deleteTodo.rejected, (state: TodoState) => {
      state.loading = false;
    });

    builder.addCase(editTodo.pending, (state: TodoState) => {
      state.loading = true;
    });
    builder.addCase(editTodo.fulfilled, (state: TodoState, { payload }) => {
      state.loading = false;
      if (payload) {
        const { _id, title } = payload as { _id: number; title: string };
        state.data[getIndex(_id, state.data)].title = title;
      }
    });
    builder.addCase(editTodo.rejected, (state: TodoState) => {
      state.loading = false;
    });
  }
});

export const { setCompleted } = todoSlice.actions;

export default todoSlice.reducer;
