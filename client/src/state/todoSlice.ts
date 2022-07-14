import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type TodoItem = {
  _id: number;
  title: string;
  completed: boolean;
};

export type ErrorRecord = {
  status: string | number | undefined;
  message: string;
};

type TodoState = {
  data: TodoItem[];
  loading: boolean;
  total: number;
  completed: number;
  error?: ErrorRecord;
};

const initialState: TodoState = {
  data: [],
  loading: true,
  total: 0,
  completed: 0
};

export const fetchTodos = createAsyncThunk<
  TodoItem[],
  void,
  {
    rejectValue: ErrorRecord;
  }
>('todos/getTodos', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:3001/api/todos', {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return response.json();
    } else {
      return rejectWithValue({
        status: response.status ?? undefined,
        message: response.statusText
      });
    }
  } catch (err) {
    const {
      response: { data, status }
    } = err as unknown as {
      response: { data: string; status: number };
    };

    return rejectWithValue({
      status: status,
      message: data
    });
  }
});

const getIndex = (id: number, arr: TodoItem[]): number => {
  return arr.findIndex((item) => item._id === id);
};

export const addTodo = createAsyncThunk<
  Partial<TodoItem>,
  Partial<TodoItem>,
  {
    rejectValue: ErrorRecord;
  }
>('todos/addTodo', async (todo: Partial<TodoItem>, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:3001/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title: todo.title }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      return response.json();
    } else {
      return rejectWithValue({
        status: response.status ?? undefined,
        message: response.statusText
      });
    }
  } catch (err) {
    const {
      response: { data, status }
    } = err as unknown as {
      response: { data: string; status: number };
    };

    return rejectWithValue({
      status: status,
      message: data
    });
  }
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (item: Partial<TodoItem>) => {
  const response = await fetch('http://localhost:3001/api/todos/' + item._id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    return item._id;
  }
});

export const editTodo = createAsyncThunk('todos/editTodo', async (item: Partial<TodoItem>) => {
  const response = await fetch('http://localhost:3001/api/todos/' + item._id, {
    method: 'PUT',
    body: JSON.stringify({ title: item.title }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    return { _id: item._id, title: item.title };
  }
});

export const toggleCompleted = createAsyncThunk<
  Partial<TodoItem>,
  Partial<TodoItem>,
  {
    rejectValue: ErrorRecord;
  }
>('todos/toggleCompleted', async (item: Partial<TodoItem>, { rejectWithValue }) => {
  const response = await fetch('http://localhost:3001/api/todos/' + item._id, {
    method: 'PUT',
    body: JSON.stringify({ completed: item.completed }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    return { _id: item._id, completed: item.completed };
  } else {
    return rejectWithValue({
      status: response.status,
      message: response.statusText
    });
  }
});

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
      state.loading = false;

      if (!payload) return;

      state.data = payload.data;
      state.total = state.data.length;
      state.completed = state.data.filter((item) => item.completed).length;
    },
    [fetchTodos.rejected.type]: (state: TodoState, { payload }) => {
      state.loading = false;
      state.error = { ...payload };
    },

    [addTodo.pending.type]: (state: TodoState) => {
      state.loading = true;
    },
    [addTodo.fulfilled.type]: (state: TodoState, { payload }) => {
      state.loading = false;
      state.data.push(payload.data);
      state.total = state.data.length;
    },
    [addTodo.rejected.type]: (state: TodoState, { payload }) => {
      state.loading = false;
      state.error = { ...payload };
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
    [editTodo.rejected.type]: (state: TodoState, { payload }) => {
      state.loading = false;
      state.error = { ...payload };
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
    [toggleCompleted.rejected.type]: (state: TodoState, { payload }) => {
      state.loading = false;
      state.error = { ...payload };
    }
  }
});

// export const {} = todoSlice.actions;

export default todoSlice.reducer;
