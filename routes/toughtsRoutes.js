const express = require('express')
const router = express.Router()
const checkAuth = require('../helpers/auth').checkAuth
const ToughtsController = require('../controller/ToughtController')


router.get('/add', checkAuth, ToughtsController.createToughts)
router.post('/add', checkAuth, ToughtsController.createToughtsSave)
router.get('/dashboard', checkAuth, ToughtsController.dashboard)
router.post('/remove', checkAuth, ToughtsController.removeTought)
router.get('/edit/:id', ToughtsController.edit)
router.post('/edit', ToughtsController.editSave)
router.get('/',ToughtsController.showToughts)

module.exports = router