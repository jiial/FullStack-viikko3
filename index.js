const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const mongoose = require('mongoose')

const url = 'mongodb://name:password@ds229448.mlab.com:29448/phonebook'

mongoose.connect(url)

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('String', function (req, res) {
    return (
        JSON.stringify(req.body)
    )
})
app.use(morgan(':method :url :String :status :res[content-length] - :response-time ms'))

const formatPerson = (person) => {
    const formattedPerson = { ...person._doc, id: person._id }
    delete formattedPerson._id
    delete formattedPerson.__v

    return formattedPerson
}


let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Martti Tienari',
        number: '040-123456'
    },
    {
        id: 3,
        name: 'Arto Järvinen',
        number: '040-123456'
    },
    {
        id: 4,
        name: 'Lea Kutvonen',
        number: '040-123456'
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person
        .find({}, { __v: 0 })
        .then(people => {
            res.json(people.map(formatPerson))
        })
})

app.get('/info', (req, res) => {
    const y = new Date()
    Person
        .find({}, { __v: 0 })
        .then(x => {
            res.send(`<div><p>puhelinluettelossa ${x.length} henkilön tiedot</p><p>${y}</p></div>`)
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            res.json(formatPerson(person))
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({ error: 'name or number missing' })
    }
    const p = persons.filter(function (person) {
        return person.name === body.name
    })
    const person = new Person({
        id: Math.floor((Math.random() * 10000) + 1),
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(savedPerson => {
            res.json(formatPerson(savedPerson))
        })
        .catch(error => {
            console.log(error)
        })
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(formatPerson(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

