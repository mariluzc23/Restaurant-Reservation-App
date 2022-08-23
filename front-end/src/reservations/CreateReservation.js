import React, { useState } from "react";
import { useHistory } from "react-router-dom"
import ReservationForm from "./ReservationForm";
import { createReservation } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert";

function CreateReservation(){
    const history = useHistory()
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: ""
    })
    const [err, setErr] = useState(false)
    
    const changeHandle = ({target})=> {
        setFormData({...formData, [target.name]: target.value})
    }

    const submitHandle = async (event)=> {
        event.preventDefault()
        setErr(false)
        const abortController = new AbortController()
        formData.people = Number(formData.people)
        try {
            const response = await createReservation(formData, abortController.signal)
            history.push(`/dashboard?date=${response.reservation_date}`)
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

    const cancelLink= ()=> history.push(`/dashboard`)

    return (
        <div>
            <h1>New Reservation</h1>
            <ErrorAlert error = {err}/>
            <ReservationForm submitHandle={submitHandle} changeHandle={changeHandle} form={formData} cancelLink={cancelLink} />
        </div>
    )
}

export default CreateReservation