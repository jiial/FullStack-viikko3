const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Gothubiin!
const url = 'mongodb://name:password@ds229448.mlab.com:29448/phonebook'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})
if (process.argv.length[0]) {
  const name = process.argv[2]
  const number = process.argv[3]

  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  person
    .save()
    .then(response => {
      console.log(`Lisätään henkilö ${name} numero ${number} luetteloon`)
      mongoose.connection.close()
    })
} else {
  Person
    .find({})
    .then(result => {
      console.log("puhelinluettelo:")
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
}


