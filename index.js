const express = require('express')
const helmet = require('helmet')
const app = express()
const port = 8000
const routes = require('./src/routes')
const cors = require('cors')

app.use(cors())
app.use(express.static('public'))
app.use(helmet())
app.use(express.json())
app.use(routes)

app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})
