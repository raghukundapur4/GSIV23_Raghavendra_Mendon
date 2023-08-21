import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_KEY = "284da1a8fc457c4b11b294594c011b42";
const GET_MOVIE_API = "https://api.themoviedb.org/3/movie/upcoming";
const SEARH_MOVIE_API = "https://api.themoviedb.org/3/search/movie";
const GET_MOVIE_DETAILS = "https://api.themoviedb.org/3/movie/";
const DEFAULT_PAGE_SIZE = 20;


const fetchMovies = createAsyncThunk("users/fetchMovies", (filter) => {
  const { page = 1, searchQuery = '' } = filter;
  let api = `${GET_MOVIE_API}?language=en-US&api_key=${API_KEY}&page=${page}`;
  let isSearch = false;
  if(searchQuery) {
    isSearch = true;
    api = `${SEARH_MOVIE_API}?language=en-US&query=${searchQuery}&api_key=${API_KEY}&page=${1}`;
  }
  return fetch(api)
    .then((response) => response.json())
    .then((parsedData) => {
      const { results, page, total_results } = parsedData;
      const hasMore = searchQuery ? false : page < Math.ceil(total_results / DEFAULT_PAGE_SIZE)
      return { results, page, hasMore, isSearch };
    });
});


const fetchMovieDetails = createAsyncThunk(
  "users/fetchMovieDetails",
  (movieId) => {
    let movieDetails;
    return fetch(`${GET_MOVIE_DETAILS}/${movieId}?api_key=${API_KEY}`)
      .then((response) => response.json())
      .then((parsedData) => {
        movieDetails = parsedData;


        return fetch(`${GET_MOVIE_DETAILS}/${movieId}/credits?api_key=${API_KEY}`)
      })
      .then((response) => response.json())
      .then((parsedData) => {
        const actorList = parsedData.cast.filter((cast) => cast.known_for_department == 'Acting');
        movieDetails.cast = (actorList.map((actor) => actor.name)).join(', ');
        const directorList = parsedData.crew.filter((cast) => cast.known_for_department == 'Directing');
        movieDetails.directors = directorList.map((director) => director.name).join(', ');
        return movieDetails;
      });
  }
);

const movieSlice = createSlice({
  name: "movie",
  reducers: {
    appendMovies: (state, action) => {
      /** If search is triggered clear the movie list and push only search results */
      if(action.payload.isSearch) {
        state.movieList = [];
        state.isSearch = true;
      }
      state.movieList.push(...action.payload.results);
    },
    appendMovie: (state, action) => {
      state.movieDetails = action.payload;
    },
    clearMovies: (state, action) => {
      state.movieList = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.isSearch = false;
      if(action.payload.isSearch) {
        state.isSearch = true;
        state.movieList = [];
      }
      state.page = action.payload.page;
      state.hasMore = action.payload.hasMore;
      state.movieList.push(...action.payload.results);
    });
    builder.addCase(fetchMovieDetails.fulfilled, (state, action) => {
      state.movieDetails = action.payload;
    });
  },
  initialState: {
    movieList: [],
    movieDetails: null,
    page: 1,
    hasMore: true,
    isSearch: false,
  }
});

const { appendMovie, appendMovies, clearMovies, searchMovie } = movieSlice.actions;

export {
  fetchMovies,
  appendMovie,
  appendMovies,
  clearMovies,
  fetchMovieDetails,
};

export default movieSlice.reducer;
