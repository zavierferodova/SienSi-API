const { Router } = require('express')
const apiRouter = require('./api.js')
const storageRouter = require('./storage.js')
const router = Router()

router.use('/api', apiRouter)
router.use('/storage', storageRouter)

router.get('/', (req, res) => {
  return res.render('index')
})

module.exports = router
