import React, {useState} from "react";
import {finishTable} from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";

function FinishTable({table}) {

    const [err, setErr] = useState(false)
    const history = useHistory()

    const clickHandle = async (event)=> {
        event.preventDefault()
        setErr(false)
        const abortController = new AbortController()
        if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")){
        try {
            await finishTable(table.table_id, table.reservation_id, abortController.signal)
            history.push("/")
        }
        catch(error) {
            if(error.name !== "AbortError") {
                setErr(error)
            }
        }
        return () => {
            abortController.abort()
        }}
    }

    return (
        <div>
            <h6 data-table-id-status={table.table_id}>Occupied</h6>
            <ErrorAlert error = {err}/>
            <button type="button" data-table-id-finish={table.table_id} className="btn btn-primary" onClick={clickHandle}>
          Finish
        </button>
        </div>
    )
}

export default FinishTable