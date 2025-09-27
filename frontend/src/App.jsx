import { useState } from 'react';
import { useEffect} from 'react';
import axios from "axios";
import './App.css';

function App() {
  const [films, setFilms] = useState([]);

  useEffect (() => {
    axios.get('http://localhost:3000/top-films').then(res => {
      console.log(res.data);
      setFilms(res.data);
    }).catch(error => {
      console.error("Failure fetching films:", error);
    })
  }, []);

  const listFilms = films.map(film =>
    <div key={film.film_id}>
      {film.title}
    </div>
  );

  return (
    <>
      <h1>Top 5 Films</h1>
      <div>
          {listFilms}
      </div>
    </>
  )
}

export default App
