import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "../styling/rentTable.css"

function RentFilm({ film }) {

    const [filmStock, setFilmStock] = useState(0);
    const [customer, setCustomer] = useState(null);
    const [rented, setRented] = useState(false);

    const [error, setError] = useState("");

    const fetchFilmStock = async () => {
        try {
            const res = await axios.post('http://localhost:3000/film-stock', { film_id: film.film_id });
            setFilmStock(res.data);
            console.log("film stock:", res.data);
        } catch (err) {
            console.error("Failed to fetch film stock:", err);
            setFilmStock(null);
        }
    };

    useEffect (() => {
        if (!film?.film_id) return;
        fetchFilmStock();
    }, [film]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!customer) {
            console.error("Enter customer id");
        }

        axios.post("http://localhost:3000/rentFilm", {customer_id : customer, film_id : film.film_id}).then(res => {
            const data = res.data;
            console.log(data);
            setRented(true);
            fetchFilmStock();
        }).catch(err => {
            console.error('Update error:', err);
            setError(err.response?.data?.error || 'Failed to rent');
        });

    }

    const handleInputChange = (e) => {
        setCustomer(e.target.value)
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
                <label for="customer">Customer ID</label>
                <input 
                    type="number" 
                    name="customer" 
                    onChange={handleInputChange} 
                    disabled={!filmStock.stock} 
                    min="0">
                </input>
                <button type="submit" name="submit" disabled={!filmStock.stock}>Rent</button>
            </form>
            {rented && <h2>Rented!</h2>}
        </>
    );
}

export default RentFilm;