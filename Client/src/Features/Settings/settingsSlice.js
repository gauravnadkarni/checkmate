import { networkService } from "../../main";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const initialState = {
  isLoading: false,
  apiBaseUrl: "http://localhost:5000/api/v1",
  logLevel: "debug",
  clientHost: "http://localhost:5173",
  jwtSecret: "my_secret",
  dbType: "MongoDB",
  dbConnectionString: "mongodb://localhost:27017/uptime_db",
  redisHost: "127.0.0.1",
  redisPort: 6379,
  jwtTTL: "99d",
  pagespeedApiKey: "",
  systemEmailHost: "smtp.gmail.com",
  systemEmailPort: 465,
  systemEmailAddress: "",
  systemEmailPassword: "",
};

export const getAppSettings = createAsyncThunk(
  "settings/getSettings",
  async (authToken, thunkApi) => {
    try {
      const res = await networkService.getAppSettings({
        authToken: authToken,
      });
      return res.data;
    } catch (error) {
      if (error.response.data) {
        return thunkApi.rejectWithValue(error.response.data);
      }
      const payload = {
        status: false,
        msg: error.message ? error.message : "Unknown error",
      };
      return thunkApi.rejectWithValue(payload);
    }
  }
);

export const updateAppSettings = createAsyncThunk(
  "settings/updateSettings",
  async (form, thunkApi) => {
    try {
      const res = await networkService.loginUser(form);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkApi.rejectWithValue(error.response.data);
      }
      const payload = {
        status: false,
        msg: error.message ? error.message : "Unknown error",
      };
      return thunkApi.rejectWithValue(payload);
    }
  }
);

const handleGetSettingsFulfilled = (state, action) => {
  state.isLoading = false;
  state.success = action.payload.success;
  state.msg = action.payload.msg;
  Object.assign(state, action.payload.data);
};
const handleGetSettingsRejected = (state, action) => {
  state.isLoading = false;
  state.success = false;
  state.msg = action.payload ? action.payload.msg : "Failed to get settings.";
};
const handleUpdateSettingsFulfilled = (state, action) => {
  state.isLoading = false;
  state.success = action.payload.success;
  state.msg = action.payload.msg;
};
const handleUpdateSettingsRejected = (state, action) => {
  state.isLoading = false;
  state.success = false;
  state.msg = action.payload
    ? action.payload.msg
    : "Failed to update settings.";
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAppSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAppSettings.fulfilled, handleGetSettingsFulfilled)
      .addCase(getAppSettings.rejected, handleGetSettingsRejected);

    builder
      .addCase(updateAppSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAppSettings.fulfilled, handleUpdateSettingsFulfilled)
      .addCase(updateAppSettings.rejected, handleUpdateSettingsRejected);
  },
});

export default settingsSlice.reducer;
