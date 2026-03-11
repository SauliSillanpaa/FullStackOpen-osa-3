require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))
app.use(cors())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  response.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <div>${Date()}</div>
    `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
 
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const generateId = () => String(getRandomInt(100000))

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(`Request body is ${body}`)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
        error: 'name or number missing' 
    })
  }

  const person = new Person({
      name: body.name,
      number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})
/*
app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(`Request body is ${body}`)

    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ 
            error: 'name already in database' 
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})
*/
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})