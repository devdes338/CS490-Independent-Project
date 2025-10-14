import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

function EditCustomerForm ({ selectedCustomer }) {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [error, setError] = useState("");

    useEffect (() => {
        const controller = new AbortController();
        axios.get(`http://localhost:3000/customer/${selectedCustomer}`, 
            {signal: controller.signal}).then(res => {
                const { data } = res;
                console.log(data);
                setFirstName(data.first_name);
                setLastName(data.last_name);
                setEmail(data.email);

        }).catch(error => {
            if (axios.isCancel(error)) return;
            console.error("Failure fetching customer:", error);
        })

        return () => controller.abort();
    }, [selectedCustomer]);

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if(!firstName.trim()) {
            setError("Enter first name");
            return;
        }

        if(!lastName.trim()) {
            setError("Enter last name");
            return;
        }

        if(!email.trim()) {
            setError("Enter email");
            return;
        }

        axios.put("http://localhost:3000/edit-customer", 
            {customer_id : selectedCustomer, firstName : firstName.trim(), lastName : lastName.trim(), email : email.trim()})
          .then(res => {
              console.log("Update response:", res.data);

              window.location.reload();
          })
          .catch(err => {
              console.error('Update error:', err);
              setError(err.response?.data?.error || 'Failed to update record in customer table');
          });
    }

    const handleDeleteSubmit = async (e) => {
        e.preventDefault();
        
        axios.delete("http://localhost:3000/delete-customer",{data : {customer_id : selectedCustomer}}).then(res => {
            console.log("Delete response", res.data)
            window.location.reload();
        })
        .catch(err => {
            console.error("Delete error:", err);
            setError(err.response?.data?.error || 'Failed to delete record in customer table');
        })
    }

    return (
        <>
            <form onSubmit={handleEditSubmit}>
                <label>First Name</label>
                <input type="text"
                    name="fname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)} />
                <label>Last Name</label>
                <input type="text" 
                    name="lname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)} />
                <label>Email</label>
                <input type="text"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                <button className="search-button" 
                    type="submit"
                    name="submit">
                        Update
                </button>
            </form>
            <form onSubmit={handleDeleteSubmit}>
                <button>Delete</button>
            </form>
        </>
    )
}

export default EditCustomerForm;