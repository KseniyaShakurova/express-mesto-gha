const router = require('express').Router();

const {
  getUsers, getUserById, createUser, editUser, editAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', editUser);
router.patch('/me/avatar', editAvatar);

module.exports = router;