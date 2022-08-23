const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties")

/**
 *  CURDL functions
 */

// function that retrieves all the reservations for a certain date or a certain mobile number
async function list(req, res) {
  const { date, mobile_number } = req.query
  if (date){
    const data = await service.list(date)
    res.json({data})
  }
  if(mobile_number) {
    const data = await service.search(mobile_number)
    res.json({data})
  }
}

async function create(req, res, next) {
  const data = await service.create(req.body.data)
  res.status(201).json({data})
}

async function read(req, res, next) {
  const data = res.locals.reservation
  res.json({data})
}

// function to update the the status of a reservation
async function updateStatus(req,res, next) {
  const {status} = req.body.data
  const {reservation_id} = res.locals.reservation
  const updatedReservation = {
    reservation_id: reservation_id,
    status: status
  }
  const data = await service.update(updatedReservation)
  res.json({data})
}

async function updateRes(req, res, next) {
  const data = await service.updateRes(req.body.data)
  res.json({data})
}

/**
 *  Validations
 */

// function to validate that a reservation has certain required properties
const properties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]

const hasRequiredProperties = hasProperties(properties)

// function to validate the format of the date
function validDate(req, res, next){
  const date = req.body.data.reservation_date
  const validDate = /\d{4}-\d{2}-\d{2}/.test(date)
  if (!date || !validDate) {
    next({
          status: 400,
          message: 'reservation_date is not valid',
        })
    }
  next()
}

// function to validate the format of the time
function validTime(req, res, next){
  const time = req.body.data.reservation_time
  const validTime = /[0-9]{2}:[0-9]{2}/.test(time)
  if (!time || !validTime) {
    next({
      status: 400,
      message: 'reservation_time is not valid',
    })
  }
  next()
}

// function to validate that people property is a number
function validPeople(req, res, next){
  const {people} = req.body.data
  if(!Number.isInteger(people)){
    next({
      status: 400,
      message: `people must be a number`,
    })
  }
  next()
}

// function to validate that the reservation is for a future date
function futureRes(req, res, next){
  const resDate = req.body.data.reservation_date
  const resTime = req.body.data.reservation_time
  const date = new Date(`${resDate} ${resTime}`)
  if(new Date() > date){
    next({
      status: 400,
      message: `Reservations must be for future dates`,
    })
  }
  next()
}

// function to validate that the reservation is not on a Tuesday
function notTuesday(req, res, next) {
  const reservationDate = req.body.data.reservation_date
  const date = new Date(reservationDate)
  const day = date.getDay()
  if(day === 1){
    next({
      status: 400,
      message: `The restaurant is closed on Tuesdays`,
    })
  }
  next()
}

// function to validate that the reservation is within the opening hours
function openHours(req, res, next){
  const resDate = req.body.data.reservation_date
  const resTime = req.body.data.reservation_time
  const date = new Date(`${resDate} ${resTime}`)
  if(date.getHours() < 10 || (date.getHours() === 10 && date.getMinutes() < 30)){
    next({
      status: 400,
      message: `The restaurant opens after 10:30 am`,
    })
  }
  if(date.getHours() > 21 || (date.getHours() === 21 && date.getMinutes() > 30)){
    next({
      status: 400,
      message: `The restaurant closes for orders after 09:30 pm`,
    })
  }
  next()
}

// function to make sure the reservation exists
async function reservationExists(req, res, next) {
  const {reservation_id} = req.params
  const reservation = await service.read(reservation_id)
  if(reservation){
      res.locals.reservation = reservation
      return next()
  }
  next({
      status: 404,
      message: `table ${reservation_id} does not exist`,
  })
}

// function that makes sure the requested reservation has a booked status
function bookedStatus(req, res, next) {
  const {status} = req.body.data
  if(status && status !== "booked"){
    next({
      status: 400,
      message: `cannot make reservations for ${status} status`,
    })
  }
  next()
}

// function that makes sure the existing reservation isn't finished so it can be updated
function notFinished(req, res, next) {
  const {status} = res.locals.reservation
  if(status !== "booked" && status !== "seated") {
    next({
      status: 400,
      message: `cannot make reservations for finished reservations`,
    })
  }
  next()
}

// function validate that the status of a reservation is one of the 4 available
function validStatus(req, res, next) {
  const {status} = req.body.data
  if(status !== "booked" && status !== "seated" && status !== "finished" && status !== "cancelled") {
    next({
      status: 400,
      message: `cannot make reservations for unknown status`,
    })
  }
  next()
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasRequiredProperties,
    validDate,
    validTime,
    validPeople,
    notTuesday,
    futureRes,
    openHours,
    bookedStatus,
    asyncErrorBoundary(create)
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  reservationExists: [asyncErrorBoundary(reservationExists)],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validStatus,
    notFinished,
    asyncErrorBoundary(updateStatus)
  ],
  updateRes: [
    asyncErrorBoundary(reservationExists),
    hasRequiredProperties,
    validDate,
    validTime,
    validPeople,
    notTuesday,
    futureRes,
    openHours,
    bookedStatus,
    asyncErrorBoundary(updateRes)
  ]
};