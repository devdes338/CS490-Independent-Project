import { useState } from "react";
import axios from "axios";


function NewCustomerForm({ showAddCustPopup, setShowAddCustPopup }) {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
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

        setError("");

        axios.post("http://localhost:3000/new-customer", 
            {firstName : firstName.trim(), lastName : lastName.trim(), email : email.trim()})
          .then(res => {
              // show insertedId clearly and reset fields
              console.log("Insert response:", res.data);
              // res.data.insertedId should contain the new customer's id
              setFirstName("");
              setLastName("");
              setEmail("");
          })
          .catch(err => {
              console.error('Insert error:', err);
              setError(err.response?.data?.error || 'Failed to insert new record into customer table');
          });


    };

    const handleFnameChange = (e) => {
        setFirstName(e.target.value);
    };

    const handleLnameChange = (e) => {
        setLastName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const closePopup = () => {
        setShowAddCustPopup(false);
    }

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="text"
                        name="fname"
                        placeholder="first name"
                        onChange={handleFnameChange} />
                    <input type="text" 
                        name="lname"
                        placeholder="last name"
                        onChange={handleLnameChange} />
                    <input type="text"
                        name="email"
                        placeholder="email"
                        onChange={handleEmailChange} />
                    <button className="search-button" 
                        type="submit"
                        name="submit"
                        disabled={!firstName.trim() || !lastName.trim() || !email.trim()}>
                            Add
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NewCustomerForm;