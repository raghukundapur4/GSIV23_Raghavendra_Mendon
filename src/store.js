import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "./reducers/movie.js";
import thunk from "redux-thunk";

const store = configureStore({
  reducer: {
    movie: movieReducer
  },
  middleware: [thunk]
});

export default store;
