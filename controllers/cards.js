const Card = require('../models/card');
const {
  BadRequest,
  ServerError,
  NotFound,
  NotError,
  CreateCode,
} = require('../utils/utils');

const getInitialCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(NotFound).send(cards))
    .catch(() => res.status(ServerError).send({ message: 'Ошибка по умолчанию. Сервер не отвечает' }));
};

const createNewCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CreateCode).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию. Сервер не отвечает' });
      }
    });
};

const deleteCard = (req, res) => {
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
      console.error(error);
      return res.status(ServerError).send({ message: 'Ошибка по умолчанию. Сервер не отвечает' });
    });
};

const likeCard = (req, res) => {
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
        return res.status(BadRequest).send({ messafe: 'Переданы некорректные данные для постановки лайка.' });
      }
      console.error(error);
      return res.status(ServerError).send({ message: 'Ошибка по умолчанию. Сервер не отвечает' });
    });
};

const disLike = (req, res) => {
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
      console.error(error);
      return res.status(ServerError).send({ message: 'Ошибка по умолчанию. Сервер не отвечает' });
    });
};

module.exports = {
  getInitialCards,
  createNewCard,
  deleteCard,
  likeCard,
  disLike,
};
