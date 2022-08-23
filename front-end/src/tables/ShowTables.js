import React from "react";
import FinishTable from "./FinishTable";

function ShowTables({tables}) {
    if(tables.length > 0){
    return (
        <div className="row">
          { tables.map((table)=> {
            return (
            <div key={table.table_id} className="col-sm-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{table.table_name}</h5>
                  <p className="card-text">Table Size: {table.capacity} 
                  <br/>
                  {table.reservation_id ? (<FinishTable table= {table}/>) : (<h6 data-table-id-status={table.table_id}>Free</h6>)}                  
                  </p>
                </div>
              </div>
            </div>
            ) 
            })}
        </div>
    )}
    return null
}

export default ShowTables