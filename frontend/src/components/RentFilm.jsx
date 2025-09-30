import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "../styling/rentTable.css"

function RentFilm({ film }) {

    const [filmStock, setFilmStock] = useState(0);
    const [rentCount, setRentCount] = useState(0);

    useEffect (() => {
        axios.post('http://localhost:3000/film-stock', {film_id: film.film_id}).then(res => {
            setFilmStock(res.data);
            console.log(filmStock.stock);
        }).catch(err => {
            console.error("Failed to fetch film stock:", err);
            setFilmStock(null);
        });
    }, [film]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!rentCount) {
            console.error("Enter rental count");
        }

        // axios.post("http://localhost:3000/rentFilm", {rentCount : rentCount, film_id : film.film_id}).then(res => {

        // }).catch(err => {
        //     console.error('Update error:', err);
        //     setError(err.response?.data?.error || 'Failed to search');
        //     setSearchResults([]);
        // });

    }

    const handleInputChange = (e) => {
        setRentCount(e.target.value)
    }

    return(
        <>
            <div className="results-wrapper">
                <table className="results-table">
                    <tr>
                        <td>Available copies</td>
                        <td>Total copies</td>
                        <td>Currently rented</td>
                    </tr>
                    <tr>
                        <td>{filmStock.stock}</td>
                        <td>{filmStock.total_copies}</td>
                        <td>{filmStock.currently_rented}</td>

                    </tr>
                </table>
            </div>
            <form onSubmit={handleSubmit}>
                <label for="rent">Rent</label>
                <input 
                    type="number" 
                    name="dvds" 
                    onChange={handleInputChange} 
                    disabled={!filmStock.stock} 
                    min="0" 
                    max={filmStock.stock}>
                </input>
                <button type="submit" name="submit" disabled={!filmStock.stock}>Rent</button>
            </form>
        </>
    );
}

export default RentFilm;