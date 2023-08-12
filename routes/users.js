const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers, getUserById, createUser, editUser, editAvatar, login, getUserInfo,
} = require('../controllers/users');

router.post('/signup', createUser);
router.post('/signin', login);
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.get('/me', auth, getUserInfo);
router.patch('/me', auth, editUser);
router.patch('/me/avatar', auth, editAvatar);

module.exports = router;
