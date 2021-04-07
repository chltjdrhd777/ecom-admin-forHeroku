import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios/axios";

//typeDef

export interface CategoryListType {
  _id: string;
  name: string;
  slug: string;
  parentId?: string;
  type?: string;
  children: CategoryListType[];
}

export interface CategoryState {
  categories: { categoryList: CategoryListType[]; docs: []; success: boolean };
  loading: "ready" | "pending" | "finished" | "failed";
  error: {
    success: boolean;
    errorInfo: any;
  };
}

//async actions
export const getAllCategories = createAsyncThunk("category/getCategories", async () => {
  try {
    const response = await axios.get("/category/getCategory");
    return response;
  } catch (err) {
    return err.response;
  }
});

export const createCategories = createAsyncThunk("category/createCategory", async (payload: any) => {
  try {
    const response = await axios.post("/category/createCategory", payload, { withCredentials: true });
    return response;
  } catch (err) {
    return err.response;
  }
});

export const updateCategory = createAsyncThunk("category/updateCategory", async (payload: FormData) => {
  try {
    const response = await axios.post("/category/update", payload, { withCredentials: true });
    return response;
  } catch (err) {
    return err.response;
  }
});

export const deleteCategories = createAsyncThunk("category/deleteCategory", async (payload: { value: string; parentId: string; name: string }[]) => {
  try {
    const response = await axios.post("/category/delete", payload, { withCredentials: true });
    return response;
  } catch (err) {
    return err.response;
  }
});
//structure
const category = createSlice({
  name: "category",

  initialState: { categories: {}, loading: "ready", error: { success: false, errorInfo: undefined } } as CategoryState,

  reducers: {
    categoryLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },

  extraReducers: (builder) => {
    //login
    builder.addCase(getAllCategories.fulfilled, (state, { payload }) => {
      if (payload !== undefined && payload.status === 400) {
        state.error = { success: false, errorInfo: payload };
      } else if (payload !== undefined && payload.status === 200) {
        state.error = { success: true, errorInfo: undefined };
        state.categories = payload.data;
      }
    });

    //update
    builder.addCase(updateCategory.fulfilled, (state, { payload }) => {
      if (payload !== undefined && payload.status === 201) {
        state.error = { success: true, errorInfo: undefined };
        state.categories.categoryList = payload.data.categoryList;
      } else {
        state.error = { success: false, errorInfo: payload };
      }
    });

    builder.addCase(deleteCategories.fulfilled, (state, { payload }) => {
      if (payload !== undefined && payload.status === 200) {
        state.error = { success: true, errorInfo: undefined };
        window.location.reload();
      } else {
        state.error = { success: false, errorInfo: payload };
      }
    });
  },
});

export default category;

//export actions
export const { categoryLoading } = category.actions;
