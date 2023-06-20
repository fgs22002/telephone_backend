const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('build')) // Servir ficheros estáticos de la carpeta 'build'

// HTTP request logger middleware for node.js
morgan.token('body', function (req, res) { 
    console.log(req.body)
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
]

/*
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
*/

app.get('/info', (request, response) => {
    const text = "<p>Phonebook has info for " + persons.length + " people</p>" + "<p>"+ new Date() + "</p>"

    response.send(text)
})


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
       response.json(person)
    } else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    function getRandomInt(max) {
        return Math.floor(Math.random() * max)
    }
    return getRandomInt(999999999)
  }

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    } else if (persons.filter((person) => person.name === body.name).length) {
        return response.status(400).json({ 
            error: 'name must be unique' 
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})