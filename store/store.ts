import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

const combinedReducers = combineReducers({
	// tracks: tracksReducer,
	// router: routerReducer,
	// wallet: walletReducer,
	// search: searchReducer,
	// player: playerReducer
});

const store = configureStore({
	reducer: combinedReducers
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
