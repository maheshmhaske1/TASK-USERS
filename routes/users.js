var express = require('express');
var router = express.Router();

var user = require('../controller/userController')
var { authenticate_user } = require('../middleware/auth')

router.post('/', user.createUser)
router.get('/', authenticate_user, user.getAll)
router.get('/:id', authenticate_user, user.get)
router.put('/:id', authenticate_user, user.update)
router.delete('/:id', authenticate_user, user.delete)

module.exports = router;
