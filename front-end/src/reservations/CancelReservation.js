import React, { useState } from "react";
import { cancelReservation } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"

function CancelReservation({reservation_id}){
    const [err, setErr] = useState(false)

    const cancelHandle = async (event)=> {
        event.preventDefault()
        setErr(false)
        const abortController = new AbortController()
        if(window.confirm("Do you want to cancel this reservation? This cannot be undone.")){
          try {
              await cancelReservation(reservation_id, abortController.signal)
              window.location.reload(true)
          }
          catch(error) {
              if(error.name !== "AbortError") {
                  setErr(error)
              }
          }
        }
        return () => {
            abortController.abort()
        }
    }


    return (
        <div>
            <ErrorAlert error = {err}/>
            <button type="button" onClick={cancelHandle} className="btn btn-danger mx-3" data-reservation-id-cancel={reservation_id}>Cancel</button>
        </div>
    )
}

export default CancelReservation