function errorHandler(err, req, res, next) {
  console.error(`Server error`, err);
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json({ message: "Internal server Error" });
}
module.exports = { errorHandler };
