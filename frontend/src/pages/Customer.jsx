import { useState } from "react";
import CustomerList from "../components/CustomerList";
import SearchCustomer from "../components/SearchCustomer";
import NewCustomerButton from "../components/NewCustomerButton";
import EditCustomerForm from "../components/EditCustomerForm";
import CustomerDetails from "../components/CustomerDetails";

function Customer() {
    const [isSearch, setIsSearch] = useState(false);
    const [editCustomer, setEditCustomer] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerDetails, setCustomerDetails] = useState(false);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [showAddCustPopup, setShowAddCustPopup] = useState(false);

    return (
        <>
            <h1>Customer</h1>
            <SearchCustomer 
                isSearch={isSearch} 
                setIsSearch={setIsSearch} 
                setEditCustomer={setEditCustomer} 
                setSelectedCustomer={setSelectedCustomer} 
                setCustomerDetails={setCustomerDetails}
                setShowDetailsPopup={setShowDetailsPopup}/>
            {!isSearch && <CustomerList 
                editCustomer={editCustomer} 
                setEditCustomer={setEditCustomer} 
                setSelectedCustomer={setSelectedCustomer}
                setCustomerDetails={setCustomerDetails}
                setShowDetailsPopup={setShowDetailsPopup}/>}
            {editCustomer && <EditCustomerForm selectedCustomer={selectedCustomer}/>}
            <NewCustomerButton showAddCustPopup={showAddCustPopup} setShowAddCustPopup={setShowAddCustPopup}/>
            {customerDetails && <CustomerDetails 
                selectedCustomer={selectedCustomer} 
                setSelectedCustomer={setSelectedCustomer} 
                setShowDetailsPopup={setShowDetailsPopup} 
                showDetailsPopup={showDetailsPopup}/>}
        </>
    );

}

export default Customer;