import "./App.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import {
  Button,
  CardActionArea,
  CardActions,
  CircularProgress
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import CardMedia from "@mui/material/CardMedia";

import { useState, useEffect } from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import InfiniteScroll from "react-infinite-scroll-component";

import HomeIcon from "@mui/icons-material/Home";
import { fetchMovies, fetchMovieDetails } from "./reducers/movie";

export function MovieDetails() {
  const { movieId } = useParams();
  const movieDetails = useSelector((state) => state.movie.movieDetails);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchMovieDetails(movieId));
  }, [movieId]);


  const formatDuration = (runtime) => {
    const date = new Date(runtime * 1000);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');


    return `${hours}:${minutes}`;
  };


  return (
    <div>
      <AppBar position="sticky" style={{ background: "white" }}>
        <Toolbar style={{ justifyContent: "space-between", padding: "12px" }}>
          <h5 style={{color: 'var(--gray)', margin: '0px'}}>Movie Details</h5>
          <IconButton aria-label="home">
            <HomeIcon style={{ color: "var(--gray)" }} />
          </IconButton>
        </Toolbar>
      </AppBar>


      {
        !movieDetails || movieDetails.id != movieId ? (
          <div className="d-flex align-items-center justify-content-center p-2">
            <CircularProgress className="m-2"/>
            <label>Loading...</label>
          </div>
        ) : (
          <Grid container spacing={1.5} style={{ padding: "12px" }}>
            <Grid item xs={2}>
              <img
                style={{ width: "100%", objectFit: "contain" }}
                src={`https://image.tmdb.org/t/p/original/${movieDetails.poster_path}`}
                alt={movieDetails.title}
                loading="lazy"
              />
            </Grid>
            <Grid item xs={10}>
              <div>
                <h5>{movieDetails.title}</h5>
                <p>
                  {movieDetails.release_date.split('-')[0]} | {formatDuration(movieDetails.runtime)} | {movieDetails.directors}
                </p>
                <p>Cast: {movieDetails.cast}</p>
                <p>{movieDetails.overview} </p>
              </div>
            </Grid>
          </Grid>
        )
      }
    </div>
  )
}

/* Component */
export default function App() {
  /* Search phrase - state */
  /* 
  Hooks 
  
  - Get/Set data/state - useState
  - To run something (side effects, fetching data from server) after the initial UI is rendered
  */
  const [searchPhrase, setSearchPhrase] = useState("");
  const movie = useSelector((state) => state.movie);
  const movieList = movie.movieList;
  const hasMore = movie.hasMore;
  var page = movie.page;
  const dispatch = useDispatch();

  function onSearch(event) {
    setSearchPhrase(event.target.value);
    const filterObj = {
      searchQuery: event.target.value,
      page
    }
    dispatch(fetchMovies(filterObj));
  }

  function loadMoreData() {
    console.log('loadmoredata');
    const filterObj = {
      searchQuery: '',
      page: page + 1
    }
    dispatch(fetchMovies(filterObj));
  }
  useEffect(() => {
    const filterObj = {
      searchQuery: '',
      page
    }
    dispatch(fetchMovies(filterObj));
  }, []);

  return (
    <>
      <div className="App">
        <AppBar position="sticky" style={{ background: "white" }}>
          <Toolbar style={{ justifyContent: "space-between", padding: "12px" }}>
            <div className="searchBar">
              <SearchIcon className="searchIcon" />
              <InputBase
                className="searchInput"
                placeholder="Search"
                value={searchPhrase}
                onChange={onSearch}
              />
            </div>

            <IconButton aria-label="home">
              <HomeIcon style={{ color: "var(--gray)" }} />
            </IconButton>
          </Toolbar>
        </AppBar>
         
        <InfiniteScroll
          dataLength={movieList.length}
          next={loadMoreData}
          hasMore={hasMore}
          loader={
            <div className="d-flex justify-content-center p-2">
              <label>Loading...</label>
            </div>
          }
          >
          <Grid container spacing={1.5} style={{ padding: "12px" }}>
            {movieList.map(
              ({
                title,
                id,
                overview,
                vote_average,
                vote_count,
                poster_path,
                backdrop_path
              }) => (
                <Grid item key={id} xs={3} xl={2} >
                  <Link to={`/movie/${id}`} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                  <Card className="movieCard">
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="250"
                        image={`https://image.tmdb.org/t/p/original/${poster_path}`}
                      />
                      <CardContent style={{ padding: "8px" }}>
                        <div className="d-flex flex-column">
                          <div className="d-flex flex-row justify-content-between">
                            <div className="movieListTitle">{title}</div>
                            <div className="movieRating">
                              <b>{vote_average}</b> ({vote_count})
                            </div>
                          </div>
                          <p className="movieDescription">{overview}</p>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                  </Link>
                </Grid>
              )
            )}
          </Grid>
        </InfiniteScroll>
      </div>
    </>
  );
}
