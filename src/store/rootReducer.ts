import { combineReducers } from "@reduxjs/toolkit";
import { userSlice } from "./user/user.store";
import { dinnerPlanSlice } from "./dinnerPlan.store";

export const rootReducer = combineReducers({
  userReducer: userSlice.reducer,
  dinnerReducer: dinnerPlanSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
