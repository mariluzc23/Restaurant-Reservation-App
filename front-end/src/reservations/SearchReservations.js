import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import {listReservations} from "../utils/api"
import ShowReservations from "./ShowReservations";

function SearchReservations() {
    const [formData, setFormData] = useState({mobile_number: ""})
    const [err, setErr] = useState(false)
    const [reservations, setReservations] = useState([])

    const changeHandle = ({target})=> {
        setFormData({...formData, [target.name]: target.value})
    }

    const submitHandle = async (event)=> {
        event.preventDefault()
        setErr(false)
        const abortController = new AbortController()
        try {
            const results = await listReservations(formData, abortController.signal)
            setReservations(results)
            setFormData({mobile_number: ""})
        }
        catch(error) {
            if(error.name !== "AbortError") {
                setErr(error)
            }
        }
        return () => {
            abortController.abort()
          }
    }


    return (
        <main>
            <h1>Search Reservations</h1>
            <ErrorAlert error = {err}/>
            <section>
                <form onSubmit={submitHandle}>
                    <div>
                        <label htmlFor="mobile_number" class="form-label">Mobile Number:</label>
                        <br />
                        <input
                            id="mobile_number"
                            class="form-control"
                            type="text"
                            placeholder="Enter a customer's phone number"
                            name="mobile_number"
                            onChange={changeHandle}
                            value={formData.mobile_number}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary m-3">Find</button>
                </form>
            </section>
            <hr/>
                {reservations.length > 0 ?
                 (
                    <section>
                        <h3>Search Results</h3>
                        <ShowReservations reservations={reservations}/>
                    </section>
                 )
                  : "No reservations found"}
            
        </main>
    )
}

export default SearchReservations