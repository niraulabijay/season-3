import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import transactionReducer from "../state/transactions/reducer";

const combinedReducers = combineReducers({
	transactions: transactionReducer,
});

const store = configureStore({
	reducer: combinedReducers
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
