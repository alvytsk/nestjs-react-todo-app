import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

type RemoteTodoItem = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

export type TodoItem = {
  id: number;
  title: string;
  completed: boolean;
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

export const fetchTodos = createAsyncThunk('users/fetchTodos', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  return response.json();
});

const getIndex = (id: number, arr: TodoItem[]) => {
  return arr.findIndex((item) => item.id === id);
};

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo: (state, { payload }) => {
      const newItem: TodoItem = {
        id: state.data.length ? state.data[state.data.length - 1].id + 1 : 0,
        title: payload.title,
        completed: false
      };
      state.data.push(newItem);
      state.total += 1;
    },
    deleteTodo: (state, { payload }) => {
      state.data.splice(getIndex(payload.id, state.data), 1);
      state.total = state.data.length;
      state.completed = state.data.filter((item) => item.completed).length;
    },
    editTodo: (state, { payload }) => {
      state.data[getIndex(payload.id, state.data)].title = payload.title;
    },
    setCompleted: (state, { payload }) => {
      const { completed } = payload;
      state.data[getIndex(payload.id, state.data)].completed = completed;
      completed ? state.completed++ : state.completed--;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.pending, (state) => {
      state.data = [];
      state.loading = true;
    });
    builder.addCase(fetchTodos.fulfilled, (state, { payload }) => {
      const filtered = payload
        .filter((item: RemoteTodoItem) => item.userId === 1)
        .map(({ userId, ...rest }) => rest)
        .splice(4, 10);
      state.data = filtered;
      state.loading = false;
      state.total = state.data.length;
      state.completed = state.data.filter((item) => item.completed).length;
    });
    builder.addCase(fetchTodos.rejected, (state) => {
      state.loading = false;
    });
  }
});

// Action creators are generated for each case reducer function
export const { addTodo, deleteTodo, editTodo, setCompleted } = todoSlice.actions;

export default todoSlice.reducer;
