const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');

const NotError = 200;
const CreateCode = 201;

const getInitialCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(NotError).send(cards))
    .catch(next);
};

const createNewCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(CreateCode).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NotFound).send({ message: ' Карточка с указанным _id не найдена.' });
      }
      return res.status(NotError).send({ message: 'Карточка удалена' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(BadRequest).send({ message: 'Неверные данные' });
      }
      return next(error);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NotFound).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.status(NotError).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      return next(error);
    });
};

const disLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NotFound).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.status(NotError).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные для снятии лайка.' });
      }
      return next(error);
    });
};

module.exports = {
  getInitialCards,
  createNewCard,
  deleteCard,
  likeCard,
  disLike,
};
