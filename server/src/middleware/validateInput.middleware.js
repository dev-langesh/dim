function validateInput(schema) {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      const errors = err.errors.map((error) => error.message);
      return res.status(400).json({ validationErrors: errors });
    }
  };
}

module.exports = { validateInput };
