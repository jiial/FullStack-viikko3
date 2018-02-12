const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())

morgan.token('String', function (req, res) {
    return (
        JSON.stringify(req.body)
    )
})
app.use(morgan(':method :url :String :status :res[content-length] - :response-time ms'))

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
    res.json(persons)
})

app.get('/info', (req, res) => {
    const x = persons.length
    const y = new Date()
    res.send(`<div><p>puhelinluettelossa ${x} henkilön tiedot</p><p>${y}</p></div>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({ error: 'name or number missing' })
    }
    const p = persons.filter(function (person) {
        return person.name === body.name
    })
    if (p.length > 0) {
        return res.status(400).json({ error: 'name already exists' })
    }

    const person = {
        id: Math.floor((Math.random() * 10000) + 1),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    res.json(person)
})

const port = process.env.port || 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

