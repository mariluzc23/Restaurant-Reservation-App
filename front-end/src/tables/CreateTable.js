import React, { useState } from "react";
import { useHistory } from "react-router-dom"
import TableForm from "./TableForm";
import { createTable } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert";

function CreateTable(){
    const history = useHistory()
    const [formData, setFormData] = useState({
        table_name: "",
        capacity: ""
    })
    const [err, setErr] = useState(false)
    
    const changeHandle = ({target})=> {
        setFormData({...formData, [target.name]: target.value})
    }

    const submitHandle = async (event)=> {
        event.preventDefault()
        setErr(false)
        const abortController = new AbortController()
        formData.capacity = Number(formData.capacity)
        try {
            await createTable(formData, abortController.signal)
            history.push(`/dashboard`)
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
            <h1>New Table</h1>
            <ErrorAlert error = {err}/>
            <TableForm submitHandle={submitHandle} changeHandle={changeHandle} form={formData} cancelLink={cancelLink} />
        </div>
    )
}

export default CreateTable