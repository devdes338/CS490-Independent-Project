import { useState } from "react";
import NewCustomerForm from "../components/NewCustomerForm"

function NewCustomerButton({ showAddCustPopup, setShowAddCustPopup }) {
    const [createCustomer, setCreateCustomer] = useState(false);

    const handleClick = async (e) => {
        setCreateCustomer(true);
        setShowAddCustPopup(true);
    };

    return (
        <>
            <button className="search-button" onClick={() => handleClick()}>Add Customer</button>
            {createCustomer && <NewCustomerForm showAddCustPopup={showAddCustPopup} setShowAddCustPopup={setShowAddCustPopup}/>}
        </>
    );
}

export default NewCustomerButton;