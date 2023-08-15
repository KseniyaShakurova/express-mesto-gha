const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers, getUserById, editUser, editAvatar, getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.get('/me', auth, getUserInfo);
router.patch('/me', auth, editUser);
router.patch('/me/avatar', auth, editAvatar);

module.exports = router;
