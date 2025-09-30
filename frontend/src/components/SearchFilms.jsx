import { useState } from "react";
import axios from "axios";
import FilmDetail from './FilmDetail';
import RentFilm from './RentFilm';
import '../styling/searchBar.css'
import '../styling/table.css';
import '../styling/popup.css';

function SearchFilms() {

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            setError("Enter search query");
            return;
        }

        setError('');

        axios.post("http://localhost:3000/search", {query : searchQuery.trim()}).then(res => {
            setSearchResults(res.data);
            console.log(res.data);
        }).catch(err => {
            console.error('Search error:', err);
            setError(err.response?.data?.error || 'Failed to search');
            setSearchResults([]);
        });
    }

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        setError("");
    }

    const handleFilmClick = (film) => {
        setSelectedFilm(film);
        console.log(film);
    }

    const listFilms = searchResults.map(film =>
        <tr 
            key={film.film_id} 
            className="clickable-row"
            onClick={() => handleFilmClick(film)}
        >
            <td>{film.title}</td>
            <td>{film.name}</td>
            <td>{film.rented}</td>
        </tr>
    );

    return (
        <>
            <form className="search-form" onSubmit={handleSubmit}>
                <input className="search-input" type="text" 
                    value={searchQuery} 
                    name="query" 
                    onChange={handleInputChange} 
                    placeholder="Enter film, actor, or genre">
                </input>
                <button className="search-button"
                    type="submit" 
                    name="Submit"
                    disabled={!searchQuery.trim()}>
                        Search
                </button>
            </form>
            <div className="results-wrap">
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Copies Rented</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listFilms}
                    </tbody>
                </table>
            </div>
            <div>
                {selectedFilm && (
                    <div className="popup">
                        <FilmDetail film={selectedFilm} className="film-details"/> 
                        <RentFilm film={selectedFilm} className="rent-film"/>
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchFilms;
