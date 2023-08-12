const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getInitialCards,
  createNewCard,
  deleteCard,
  likeCard,
  disLike,
} = require('../controllers/cards');

router.get('/', auth, getInitialCards);
router.post('/', auth, createNewCard);
router.delete('/:cardId', auth, deleteCard);
router.put('/:cardId/likes', auth, likeCard);
router.delete('/:cardId/likes', auth, disLike);

module.exports = router;
