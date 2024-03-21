const express = require('express')
const helmet = require('helmet')
const app = express()
const port = 3000
const routes = require('./src/routes')
const path = require('path')

app.set('views', path.join(__dirname, 'resources/views'))
app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(helmet())
app.use(express.json())
app.use(routes)

app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})
