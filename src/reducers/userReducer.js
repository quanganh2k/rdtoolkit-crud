import { apiUrls } from "../constants/apiUrls";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import queryString from "query-string";

export const addUser = createAsyncThunk(
  "user/create",
  async ({ data, callback }, { rejectWithValue }) => {
    try {
      const response = await axios.post(apiUrls.USER, data);

      const status = response.status === 201;

      callback?.onSuccess && callback?.onSuccess(status);

      return response.data;
    } catch (error) {
      const status = error.response.status === 201;
      const message = error.response.data.message;
      callback?.onError && callback?.onError(status, message);

      return rejectWithValue(error.response.data);
    }
  }
);

export const getListUsers = createAsyncThunk(
  "user/getList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${apiUrls.USER}?${queryString.stringify(query)}`
      );

      return response.data;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const editUser = createAsyncThunk(
  "user/edit",
  async ({ id, data, callback }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${apiUrls.USER}/${id}`, data);

      const status = response.status === 200;

      callback?.onSuccess && callback?.onSuccess(status);
      return response.data;
    } catch (error) {
      console.log("error", error);
      const status = error.response.status === 200;
      const message = error.response.data.message;
      callback?.onError && callback?.onError(status, message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserDetails = createAsyncThunk(
  "user/getDetails",
  async ({ id, onError }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrls.USER}/${id}`);

      return response.data;
    } catch (error) {
      onError && onError(error.response.data.message);
      console.log("error", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async ({ id, callback }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${apiUrls.USER}/${id}`);

      const status = response.status === 200;

      callback?.onSuccess && callback?.onSuccess(status);
    } catch (error) {
      const status = error.response.status === 200;
      const message = error.response.data.message;
      callback?.onError && callback?.onError(status, message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    user: null,
    paging: null,
    isLoadingCreate: false,
    errorCreate: null,
    statusCreate: false,
    isLoadingList: false,
    errorList: null,
    userEdit: null,
    isLoadingEdit: false,
    errorEdit: null,
    statusEdit: false,
    isLoadingDetail: false,
    errorDetail: null,
  },
  reducers: {
    clearListUsers: (state, action) => {
      state.users = [];
      state.paging = null;
    },
    clearUserDetails: (state, action) => {
      state.user = null;
    },
    saveUserEdit: (state, action) => {
      state.userEdit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addUser.pending, (state, action) => {
      state.isLoadingCreate = true;
      state.errorCreate = null;
    });
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.isLoadingCreate = false;
      state.errorCreate = null;
      state.statusCreate = true;
    });
    builder.addCase(addUser.rejected, (state, action) => {
      state.isLoadingCreate = false;
      state.errorCreate = action.payload.message;
      state.statusCreate = false;
    });
    builder.addCase(getListUsers.pending, (state, action) => {
      state.isLoadingList = true;
      state.errorList = null;
    });
    builder.addCase(getListUsers.fulfilled, (state, action) => {
      state.isLoadingList = false;
      state.errorList = false;
      state.users = action.payload.data;
      state.paging = action.payload.paging;
    });
    builder.addCase(getListUsers.rejected, (state, action) => {
      state.isLoadingList = false;
      state.errorList = action.payload.message;
    });
    builder.addCase(getUserDetails.pending, (state, action) => {
      state.isLoadingDetail = true;
      state.errorDetail = null;
    });
    builder.addCase(getUserDetails.fulfilled, (state, action) => {
      state.isLoadingDetail = false;
      state.errorDetail = false;
      state.user = action.payload.data;
    });
    builder.addCase(getUserDetails.rejected, (state, action) => {
      state.isLoadingDetail = false;
      state.errorDetail = action.payload.message;
    });
    builder.addCase(editUser.pending, (state, action) => {
      state.isLoadingEdit = true;
      state.errorEdit = null;
    });
    builder.addCase(editUser.fulfilled, (state, action) => {
      state.isLoadingEdit = false;
      state.errorEdit = null;
      state.statusEdit = true;
    });
    builder.addCase(editUser.rejected, (state, action) => {
      state.isLoadingEdit = false;
      state.errorEdit = action.payload.message;
      state.statusEdit = false;
    });
  },
});
// Action creators
export const { clearListUsers, saveUserEdit, clearUserDetails } =
  userSlice.actions;
export default userSlice.reducer;
