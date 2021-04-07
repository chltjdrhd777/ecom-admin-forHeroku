import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios/axios";

//typeDef

export interface UserState {
  userInfo?: {
    email: string;
    role: string;
    _id: string;
    token?: string;
  };
  loading: "ready" | "pending" | "finished" | "failed";
  error: {
    success: boolean;
    errorInfo: any;
  };
}

//async actions
export const userLogins = createAsyncThunk("users/loginRequest", async (payload: any) => {
  try {
    if (payload.email === "admin@naver.com") {
      const response = await axios.post("/auth_admin/login", { ...payload }, { withCredentials: true });
      return response;
    } else {
      const response = await axios.post("/auth/login", { ...payload }, { withCredentials: true });
      return response;
    }
  } catch (err) {
    return err.response;
  }
});

export const userLogouts = createAsyncThunk("/users/logoutReqeust", async (payload: any) => {
  const userInfo = localStorage.getItem("userInfo");
  const rendered = JSON.parse(userInfo!);

  try {
    if (rendered.email === "admin@naver.com") {
      const response = await axios.post("auth_admin/logout", { ...payload }, { withCredentials: true });
      return response;
    } else {
      const response = await axios.post("auth/logout", { ...payload }, { withCredentials: true });
      return response;
    }
  } catch (err) {
    return err.response;
  }
});

export const userRegisters = createAsyncThunk("users/registerRequest", async (payload: any) => {
  try {
    const response = await axios.post("/auth/register", { ...payload });
    return response;
  } catch (err) {
    return err.response;
  }
});

//structure
const user = createSlice({
  name: "user",

  initialState: { userInfo: undefined, loading: "ready", error: { success: false, errorInfo: undefined } } as UserState,

  reducers: {
    loadingState: (state, { payload }) => {
      state.loading = payload;
    },
    login: (state, { payload }) => {
      state.userInfo = { ...payload };
    },
    logout: (state) => {
      state.userInfo = undefined;
      localStorage.clear();
    },
    errorhandler: (state, { payload }) => {
      state.error.success = payload;
    },
  },
  extraReducers: (builder) => {
    //login
    builder.addCase(userLogins.fulfilled, (state, { payload }) => {
      console.log(payload);
      if (payload && payload.status === 400) {
        state.error = { success: false, errorInfo: payload };
      } else if (payload && payload.status === 200) {
        if (payload.data && payload.data.targetUser) {
          const { targetUser } = payload.data;
          targetUser.token && localStorage.setItem("token", targetUser.token);

          localStorage.setItem("userInfo", JSON.stringify({ email: targetUser.email, role: targetUser.role, _id: targetUser._id }));

          state.userInfo = {
            email: targetUser.email,
            role: targetUser.role,
            _id: targetUser._id,
            token: targetUser.token,
          };
        }

        if (payload.data && payload.data.targetAdmin) {
          const { targetAdmin } = payload.data;

          localStorage.setItem("token", targetAdmin.token);

          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              email: targetAdmin.email,
              role: targetAdmin.role,
              _id: targetAdmin._id,
            })
          );

          state.userInfo = {
            email: targetAdmin.email,
            role: targetAdmin.role,
            _id: targetAdmin._id,
            token: targetAdmin.token,
          };
        }
      }
      /*     if (payload && payload.status === 400) {
        state.error = { success: false, errorInfo: payload };
      } else if (payload && payload.status === 200) {
        if (payload.targetUser) {
          localStorage.setItem("token", payload.targetUser.token);
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              email: payload.targetUser.email,
              role: payload.targetUser.role,
              _id: payload.targetUser._id,
            })
          );

          state.userInfo = {
            email: payload.targetUser.email,
            role: payload.targetUser.role,
            _id: payload.targetUser._id,
            token: payload.targetUser.token,
          };
        } else {
          localStorage.setItem("token", payload.targetAdmin.token);
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              email: payload.targetAdmin.email,
              role: payload.targetAdmin.role,
              _id: payload.targetAdmin._id,
            })
          );

          state.userInfo = {
            email: payload.targetAdmin.email,
            role: payload.targetAdmin.role,
            _id: payload.targetAdmin._id,
            token: payload.targetAdmin.token,
          };
        }
      } */
    });

    //register
    builder.addCase(userRegisters.fulfilled, (state, { payload }) => {
      const { resData } = payload.data;
      if (payload.status === 400 || !resData) {
        state.error = { success: false, errorInfo: payload };
        console.log(payload);
      } else {
        state.error = { success: true, errorInfo: {} };
        state.userInfo = resData;
      }
    });

    //logout
    builder.addCase(userLogouts.fulfilled, (state, { payload }) => {
      if (payload.status === 400) {
        console.log(payload);
      } else {
        state.userInfo = undefined;
        localStorage.clear();
        window.location.href = "/";
      }
    });
  },
});

export default user;

//export actions
export const { loadingState, login, logout, errorhandler } = user.actions;
