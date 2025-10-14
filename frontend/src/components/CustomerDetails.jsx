import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import '../styling/popup.css';
import "../styling/table.css";

function CustomerDetails({ selectedCustomer, setSelectedCustomer, setShowDetailsPopup, showDetailsPopup }) {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [rented, setRented] = useState([]);
    

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchRentedFilms = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/customer/${selectedCustomer}/rented`);
            setRented(res.data || []);
        } catch (err) {
            console.error("Failed to fetch rented films:", err);
        }
    };

    const handleReturn = async (rental_id) => {
        if (!rental_id) {
            console.error("no rental_id found");
            return;
        }

        try {
            await axios.put("http://localhost:3000/return-film", { rental_id });
            await fetchRentedFilms();
        } catch (err) {
            console.error("Return film error:", err);
        }
    };

    useEffect(() => {
      if (!selectedCustomer) return;
      const controller = new AbortController();

      axios.get(`http://localhost:3000/customer/${selectedCustomer}`, 
          { signal: controller.signal })
          .then(res => {
              const data = res.data || {};
              setFirstName(data.first_name);
              setLastName(data.last_name);
              setEmail(data.email);
          })
          .catch(err => {
              if (axios.isCancel(err)) return;
              console.error("Failure fetching customer:", err);
          });

      fetchRentedFilms();

      return () => controller.abort();
    }, [selectedCustomer]);

    const lastIndex = currentPage * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage;
    const currentRows = rented.slice(firstIndex, lastIndex);

    const listRented = currentRows.map(rental =>
      <tr key={rental.rental_id}>
        <td>{rental.title}</td>
        <td>{rental.rental_date}</td>
        <td>{rental.return_date ? rental.return_date : <button onClick={() => handleReturn(rental.rental_id)}>return</button>}</td>
      </tr>
    );

    const closePopup = () => {
      setSelectedCustomer(false);
      setShowDetailsPopup(false);
    }

    return (
        <div id="popup-1" className={`popup ${showDetailsPopup ? "active" : ""}`}>
          <div className="overlay"></div>
          <div className="content">
            <div className="close-btn clickable" onClick={closePopup}>&times;</div>
            <h2>{firstName} {lastName}</h2>
            <h3>{email}</h3>
            <div className="results-wrap">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Rented Films</th>
                    <th>Rental Date</th>
                    <th>Return Date</th>
                  </tr>
                </thead>
                <tbody>
                  {listRented}
                </tbody>
              </table>
            </div>
            <Pagination 
                totalRows={rented.length} 
                rowsPerPage={rowsPerPage} setCurrentPage={setCurrentPage} 
                currentPage={currentPage} 
            />
          </div>
        </div>
    );
}

export default CustomerDetails;