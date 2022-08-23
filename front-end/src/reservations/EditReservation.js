import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom"
import ReservationForm from "./ReservationForm"
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, updateReservation } from "../utils/api";

function EditReservation() {
    const { reservation_id } = useParams()
    const [reservation, setReservation] = useState({})

    const [err, setErr] = useState(false)
    const history = useHistory()

    useEffect(()=>{
        async function getReservation() {
            const response = await readReservation(reservation_id)
            setReservation(response)
        } getReservation()
    }, [reservation_id])
    
    const changeHandle = ({target})=> {
        setReservation({...reservation, [target.name]: target.value})
    }

    const submitHandle = async (event)=> {
        event.preventDefault()
        setErr(false)
        const abortController = new AbortController()
        reservation.people = Number(reservation.people)
        try {
            const response = await updateReservation(reservation, abortController.signal)
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

    const cancelLink= ()=> history.goBack()


    return (
        <div>
            <h1>Edit Reservation</h1>
            <ErrorAlert error = {err}/>
            <ReservationForm submitHandle={submitHandle} changeHandle={changeHandle} form={reservation} cancelLink={cancelLink} />
        </div>
    )
}

export default EditReservation