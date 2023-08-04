const User = require('../models/user');
const {
  BadRequest,
  ServerError,
  NotFound,
  NotError,
  CreateCode,
} = require('../utils/utils');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(NotError).send({ data: users }))
    .catch(() => {
      res.status(ServerError).send({ message: 'Ошибка по умолчанию. Сервер не отвечает' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NotFound).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(NotError).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(BadRequest).send({ message: 'Ошибка: Неверные данные' });
      }
      return res.status(ServerError).send({ message: 'Ошибка по умолчанию. Сервер не отвечает' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(CreateCode).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Ошибка: Неверные данные' });
      }
      return res.status(ServerError).send({ message: 'Ошибка по умолчанию. Сервер не отвечает' });
    });
};

const editUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NotFound).send({ message: ' Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(NotError).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(ServerError).send({ message: 'Ошибка по умолчанию. Сервер не отвечает' });
    });
};

const editAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(BadRequest).send({ message: ' Переданы некорректные данные при обновлении аватара.' });
  }
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NotFound).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(NotError).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Ошибка: Неверные данные.' });
      }
      return res.status(ServerError).send({ message: 'Ошибка по умолчанию. Сервер не отвечает' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  editUser,
  editAvatar,
};
