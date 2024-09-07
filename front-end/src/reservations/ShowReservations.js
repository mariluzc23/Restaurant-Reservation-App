import React from "react";
import CancelReservation from "./CancelReservation";

function ShowReservations({reservations}) {
  
  if(reservations.length > 0){
    return (
        <ol className="list-group list-group-numbered">
          { reservations.map((reservation)=> {
          const {people, first_name, last_name, reservation_id, mobile_number, status} = reservation
            return <li key={reservation_id} className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">{first_name} {last_name}</div>
              <span>Number of people: {people}</span>
              <br/>
              <span>Mobile Number: {mobile_number}</span>
              <br/>
              <span>Reservation Number: {reservation_id}</span>
              <br/>
              <span data-reservation-id-status={reservation_id}>Reservation status: {status}</span>
            </div>
            {status === "booked" ?
              <a href={`/reservations/${reservation_id}/seat`} className="btn btn mx-3" style={{backgroundColor: '#8eb69b'}}>Seat</a>
              : <div></div>
            }
            <a href={`/reservations/${reservation_id}/edit`} className="btn btn mx-3" style={{backgroundColor: '#8eb69b'}}>Edit</a>
            <CancelReservation reservation_id={reservation_id} />
          </li>
    })}
        </ol>
  )}
  return <h4>No reservations for the requested date</h4>
}

export default ShowReservations