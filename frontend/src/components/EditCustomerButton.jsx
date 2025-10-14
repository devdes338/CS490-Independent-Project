import { useState } from "react";
import EditCustomerForm from "./EditCustomerForm"

function EditCustomerButton({ setEditCustomer, setSelectedCustomer, customerId }) {

    const handleClick = async (e) => {
        setEditCustomer(true);
        setSelectedCustomer(customerId);
    }
    
    return (
        <>
            <button onClick={() => handleClick()}>Edit</button>
        </>
    );
}

export default EditCustomerButton;