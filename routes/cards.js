const router = require('express').Router();

const {
  getInitialCards,
  createNewCard,
  deleteCard,
  likeCard,
  disLike,
} = require('../controllers/cards');

router.get('/', getInitialCards);
router.post('/', createNewCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', disLike);

module.exports = router;
