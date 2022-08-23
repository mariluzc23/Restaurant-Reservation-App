const knex = require("../db/connection");

function list(){
    return knex("tables")
        .select("*")
        .orderBy("table_name")
}

function read(table_id){
    return knex("tables")
        .select("*")
        .where({table_id: table_id})
        .first()
}

function create(table){
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((createdRecords)=> createdRecords[0])
}

// function to seat a reservaion, updates the reservaion status to seated and adds the reservation id to the table
function update({ reservation_id, table_id }) {
    return knex.transaction((trx) => {
        return knex("reservations")
            .transacting(trx)
            .where({ reservation_id })
            .update({ status: "seated" })
            .then(() => {
                return knex("tables")
                    .transacting(trx)
                    .where({ table_id })
                    .update({ reservation_id: reservation_id })
                    .returning("*")
            })
            .then(trx.commit)
            .catch(trx.rollback);
    })
}

// function for a done reservation, updates the reservaion status to finishes and delete the reservation id from the table
function finished({ table_id, reservation_id }) {
    return knex.transaction((trx) => {
        return knex("reservations")
            .transacting(trx)
            .where({ reservation_id })
            .update({ status: "finished" })
            .then(() => {
                return knex("tables")
                    .transacting(trx)
                    .where({ table_id })
                    .update({ reservation_id: null })
                    .returning("*")
            })
            .then(trx.commit)
            .catch(trx.rollback);
    })
}

module.exports = {
    create,
    list,
    read,
    update,
    finished,
};