import { useState } from "react";
import { useEffect } from "react";
import axios from "axios"
import Pagination from "./Pagination";
import EditCustomerButton from "./EditCustomerButton";
import "../styling/table.css";

function CustomerList({ setEditCustomer, setSelectedCustomer, setCustomerDetails, setShowDetailsPopup}) {
    
    const [customerArray, setCustomerArray] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    useEffect (() => {
        axios.get('http://localhost:3000/customer').then(res => {
            console.log(res.data);
            setCustomerArray(res.data);
        }).catch(error => {
            console.error("Failure fetching films:", error);
        })
    }, []);

    const handleCustomerClick = (customer) => {
        setSelectedCustomer(customer.customer_id);
        setShowDetailsPopup(true);
        setCustomerDetails(true);
    }

    const lastIndex = currentPage * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage;
    const currentRows = customerArray.slice(firstIndex, lastIndex);

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

    return(
        <>
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
                totalRows={customerArray.length} 
                rowsPerPage={rowsPerPage} setCurrentPage={setCurrentPage} 
                currentPage={currentPage} 
            />
        </>
    );
};

export default CustomerList