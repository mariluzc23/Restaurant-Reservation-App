const knex = require("../db/connection");

function create(reservation){
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdRecords)=> createdRecords[0])
}

// function that retrieves all the reservations for a certain date that are either booked or seated
function list(date){
    return knex("reservations")
        .select("*")
        .where({ reservation_date: date})
        .whereNot({status: "finished"})
        .whereNot({status: "cancelled"})    
        .orderBy("reservation_date")
        .orderBy("reservation_time")
}

function read(reservation_id){
    return knex("reservations")
        .select("*")
        .where({reservation_id: reservation_id})
        .first()
}

// function to update the the status of a reservation
function update(updatedReservation){
    return knex("reservations")
    .select("*")
    .where({reservation_id: updatedReservation.reservation_id})
    .update({status: updatedReservation.status}, "*")
    .then((updatedRecords)=> updatedRecords[0])
}

// function to search reservations with a given mobile number
function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
}

// function to update a reservation
function updateRes(updatedReservation){
    return knex("reservations")
    .select("*")
    .where({reservation_id: updatedReservation.reservation_id})
    .update(updatedReservation, "*")
    .then((updatedRecords)=> updatedRecords[0])
}

module.exports = {
    create,
    list,
    read,
    update,
    search,
    updateRes,
};