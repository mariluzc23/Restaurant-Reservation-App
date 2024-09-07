import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import {previous, next, today} from "../utils/date-time"
import ShowReservations from "../reservations/ShowReservations";
import ShowTables from "../tables/ShowTables";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

 function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory()
  const [currentDate, setCurrentDate] = useState(date)
  const route = useRouteMatch()
  const query = useQuery()
  const [tables, setTables] = useState([])

  useEffect(loadDashboard, [currentDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: currentDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  useEffect(()=>{
    const abortController = new AbortController();
    setReservationsError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setReservationsError);
    return () => abortController.abort();
  }, [])

  useEffect(() => {
    function getDate() {
      const queryDate = query.get("date")
      if (queryDate) {
        setCurrentDate(queryDate)
      } else {
        setCurrentDate(today())
      }
    }
    getDate()
  }, [query, route])

  useEffect(loadDashboard, [currentDate])

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h3 className="mb-0">Reservations for {currentDate}</h3>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="d-grid gap-2 d-md-flex justify-content-center">
        <button type="button" className="btn btn mx-2 my-2" style={{backgroundColor: '#8eb69b'}} onClick={()=> {
          history.push(`/dashboard?date=${previous(currentDate)}`)
          setCurrentDate(previous(date))
          }}>
        Previous
        </button>
        <button type="button" className="btn btn mx-2 my-2" style={{backgroundColor: '#8eb69b'}} onClick={
          ()=> {history.push(`/dashboard?date=${today()}`)
          setCurrentDate(today())
          }}>
          Today
        </button>
        <button type="button" className="btn btn mx-2 my-2" style={{backgroundColor: '#8eb69b'}} onClick={()=> {
          history.push(`/dashboard?date=${next(currentDate)}`)
          setCurrentDate(next(date))
          }}>
          Next
        </button>
      </div>
      <br />
      <ShowReservations reservations={reservations} />
      <hr/>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>
      <ShowTables tables={tables} />
    </main>
  );
}


export default Dashboard;
