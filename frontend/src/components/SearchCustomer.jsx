import { useState } from "react";
import axios from "axios";
import EditCustomerButton from "./EditCustomerButton";
import Pagination from "./Pagination";


function SearchCustomer({ isSearch, setIsSearch, setEditCustomer, setSelectedCustomer, setCustomerDetails, setShowDetailsPopup }) {

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState("");

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!searchQuery.trim()) {
            setIsSearch(false);
            setError("Enter search query");
            return;
        }

        setError('');

        axios.post("http://localhost:3000/search-customers", {query : searchQuery.trim()}).then(res => {
            setSearchResults(res.data);
            setIsSearch(true);
            console.log(res.data);
        }).catch(err => {
            console.error('Search error:', err);
            setError(err.response?.data?.error || 'Failed to search');
            setSearchResults([]);
            setIsSearch(false);
        });

    };

    const lastIndex = currentPage * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage;
    const currentRows = searchResults.slice(firstIndex, lastIndex);

    const handleCustomerClick = (customer) => {
        setSelectedCustomer(customer.customer_id);
        setShowDetailsPopup(true);
        setCustomerDetails(true);
    }

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        setError("");
        if (!searchQuery.trim()) setIsSearch(false);
    };

    const listCustomers = currentRows.map(customer => 
        <tr key={customer.customer_id} className="clickable-row">
            <td onClick={() => handleCustomerClick(customer)}>{customer.first_name}</td>
            <td>{customer.last_name}</td>
            <td>{customer.customer_id}</td>
            <td><EditCustomerButton  
                setEditCustomer={setEditCustomer} 
                customerId={customer.customer_id} 
                setSelectedCustomer={setSelectedCustomer}/>
            </td>
        </tr>
    );

    return (
        <>
            <form className="search-form " onSubmit={handleSubmit}>
                <input className="search-input" type="text"
                    value={searchQuery}
                    name="query"
                    onChange={handleInputChange}
                    placeholder="Enter customer name or id">
                </input>
                <button className="search-button"
                    type="submit"
                    name="Submit"
                    disabled={!searchQuery.trim()}>
                        Search
                </button>
            </form>
            {isSearch && (
                <div>
                    <div className="results-wrap">
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Customer ID</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {listCustomers}
                        </tbody>
                    </table>
                </div>
                 <Pagination 
                    totalRows={searchResults.length} 
                    rowsPerPage={rowsPerPage} setCurrentPage={setCurrentPage} 
                    currentPage={currentPage} />
            </div>
            )}
        </>
    );
}

export default SearchCustomer;