const mongoose = require('mongoose')

const url = 'mongodb://name:password@ds229448.mlab.com:29448/phonebook'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person