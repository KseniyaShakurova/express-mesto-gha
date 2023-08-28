const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFound = require('../errors/NotFound');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('/*', (req, res, next) => {
  next(new NotFound('Не известный запрос'));
});

module.exports = router;
