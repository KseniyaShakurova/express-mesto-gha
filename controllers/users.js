const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');

const ConflictError = require('../errors/ConflictError');
const newError = require('../middlewares/newError');
const Unauthorized = require('../errors/Unauthorized');

const NotError = 200;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(NotError).send({ users }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail(() => {
      throw new Unauthorized('Неправильная почта или пароль');
    }).then((user) => {
      if (bcrypt.compare(password, user.password)) {
        return user._id;
      }
      throw new Unauthorized('Неправильная почта или пароль');
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res.status(200).cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .send({ _id: user._id });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => {
      res.status(NotError).send({ data: user });
    })

    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return newError(NotFound, req, res);
      }

      return next(err);
    });
};

const getUserById = (req, res, next) => {
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
      return next(error);
    });
};

const editUser = (req, res, next) => {
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
      return next(error);
    });
};

const editAvatar = (req, res, next) => {
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
      return next(error);
    });
};

module.exports = {
  getUsers,
  getUserInfo,
  getUserById,
  createUser,
  editUser,
  editAvatar,
  login,
};
