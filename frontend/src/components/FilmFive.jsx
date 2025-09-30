import { useState } from 'react';
import { useEffect} from 'react';
import axios from "axios";
import FilmDetail from './FilmDetail';
import "../styling/FilmFive.css";

function FilmFive() {
  const [films, setFilms] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);

  useEffect (() => {
    axios.get('http://localhost:3000/top-films').then(res => {
      console.log(res.data);
      setFilms(res.data);
    }).catch(error => {
      console.error("Failure fetching films:", error);
    })
  }, []);

  const handleFilmClick = (film) => {
    setSelectedFilm(film);
  }

  const listFilms = films.map(film =>
    <div key={film.film_id} onClick={() => handleFilmClick(film)} className="top-film">
      <p>{film.title}</p>
      <p>{film.rented}</p>
    </div>
  );

  return (
    <>
      <h1>Top 5 Films</h1>
      <div className="film-five">
          {listFilms}
      </div>
      {selectedFilm && <FilmDetail film={selectedFilm}/>}
    </>
  )
};

export default FilmFive
