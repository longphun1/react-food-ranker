import { createSlice } from "@reduxjs/toolkit";

export const dinnerPlanSlice = createSlice({
  name: "dinnerPlan",
  initialState: { value: "blank" },
  reducers: {
    homemade: (state) => {
      state.value = "Cook a meal";
    },
    eatout: (state) => {
      state.value = "Order food";
    },
  },
});

export const { homemade, eatout } = dinnerPlanSlice.actions;
