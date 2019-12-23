#!/bin/node
const fs = require('fs')
const stringify = require('csv-stringify')
const schema = require('../i18n.schemas')

const field = {
  description: '',
  namespace: 'lifelines-webshop'
}

const translations = Object.keys(schema.en).map((id) => [
  id, id, field['namespace'], field['description'], schema.en[id], '', '', '', '', '', '', ''
])

input = [
  ['id', 'msgid', 'namespace', 'description', 'en', 'nl', 'de', 'es', 'it', 'pt', 'fr', 'xx']
].concat(translations)

stringify(input, (err, csvString) => {
  if (err) {
    console.error(err)
  } else {
    fs.writeFile('./datasets/sys_L10nString.csv', csvString, (err) => {
      if (err) {
        console.error(err)
      }
    })
  }

  console.log(csvString)
})
