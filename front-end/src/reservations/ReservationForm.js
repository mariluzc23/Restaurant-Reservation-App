import React from "react";
import moment from "moment";

function ReservationForm({submitHandle, changeHandle, form, cancelLink}){
   const date = moment(form.reservation_date).format("yyyy-MM-DD")

 
   
 
    return (
        <form onSubmit={submitHandle}>
            <div>
                <label htmlFor="first_name" className="form-label">First Name</label>
                <br />
                <input
                    id="first_name"
                    className="form-control"
                    type="text"
                    placeholder="First Name"
                    name="first_name"
                    onChange={changeHandle}
                    value={form.first_name}
                    required
                    />
            </div>
            <div>
                <label htmlFor="last_name" className="form-label">Last Name</label>
                <br />
                <input
                    id="last_name"
                    className="form-control"
                    type="text"
                    placeholder="Last Name"
                    name="last_name"
                    onChange={changeHandle}
                    value={form.last_name}
                    required
                    />
            </div>
            <div>
                <label htmlFor="mobile_number" className="form-label">Mobile Number</label>
                <br />
                <input
                    id="mobile_number"
                    className="form-control"
                    type="tel"
                    placeholder="(---) --- ----"
                    name="mobile_number"
                    onChange={changeHandle}
                    value={form.mobile_number}
                    required
                    />
            </div>
            <div>
                <label htmlFor="reservation_date" className="form-label">Reservation Date</label>
                <br />
                <input
                    id="reservation_date"
                    className="form-control"
                    type="date"
                    pattern="\d{4}-\d{2}-\d{2}"
                    placeholder="YYYY-MM-DD"
                    name="reservation_date"
                    onChange={changeHandle}
                    value={date}
                    required
                    />
            </div>
            <div>
                <label htmlFor="reservation_time" className="form-label">Reservation Time</label>
                <br />
                <input
                    id="reservation_time"
                    className="form-control"
                    type="time"
                    pattern="[0-9]{2}:[0-9]{2}"
                    placeholder="HH:MM"
                    name="reservation_time"
                    onChange={changeHandle}
                    value={form.reservation_time}
                    required
                    />
            </div>
            <div>
                <label htmlFor="people" className="form-label">Party Size</label>
                <br />
                <input
                    id="people"
                    className="form-control"
                    type="number"
                    min={1}
                    placeholder="select a party size"
                    name="people"
                    onChange={changeHandle}
                    value={form.people}
                    required
                    />
            </div>
            <button type="button" onClick={cancelLink} className="btn btn-danger">Cancel</button>
            <button type="submit" className="btn btn-primary m-3">Submit</button>
        </form>
    )
}

export default ReservationForm