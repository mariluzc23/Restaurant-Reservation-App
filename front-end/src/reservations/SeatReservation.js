import React, {useState, useEffect} from "react";
import {listTables, seatTable} from "../utils/api"
import { useParams, useHistory } from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert";

function SeatReservation(){
    const {reservation_id} = useParams()
    const [tables, setTables] = useState([])
    const [tablesError, setTablesError] = useState(false)
    const [formData, setFormData] = useState({table_id: ""})
    const history = useHistory()
    
    useEffect(()=>{
        const abortController = new AbortController();
        setTablesError(null);
        listTables(abortController.signal)
          .then(setTables)
          .catch(setTablesError);
        return () => abortController.abort();
    }, [reservation_id])

    const handleChange = ({target})=>{
        setFormData({...formData, [target.name]: target.value})
    }

    const submitHandle = async (event)=> {
        event.preventDefault()
        setTablesError(false)
        const tableId = Number(formData.table_id)
        const reservationId = Number(reservation_id)
        const abortController = new AbortController()
        try {
            await seatTable(tableId, reservationId, abortController.signal)
            history.push(`/dashboard`)
        }
        catch(error) {
            if(error.name !== "AbortError") {
                setTablesError(error)
            }
        }
        return () => {
            abortController.abort()
          }
    }
    
    return (
        <div>
            <h3>Seat Reservaion Number {reservation_id}</h3>
            <ErrorAlert error={tablesError} />
            <form onSubmit={submitHandle}>
                <label htmlFor="table_id"> Choose a table:
            <br/>
            <select
                id="table_id"
                name="table_id"
                onChange= {handleChange}
                value={formData.table_id}
            >
                <option value="">-- Select an Option --</option>
                {tables.map((table)=>
                <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
                )}
            </select>
            </label>
            <br/>
            <button type="submit" className="btn btn-primary m-3">Submit</button>
            <button type="button" onClick={()=> history.goBack()} className="btn btn-secondary m-3">Cancel</button>
            </form>
        </div>
    )
}

export default SeatReservation