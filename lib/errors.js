class NotFoundError extends Error {}
class ForbiddenError extends Error {}
class TooManyError extends Error {}
class BadRequestError extends Error {}
module.exports = {
  TooManyError,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
};
