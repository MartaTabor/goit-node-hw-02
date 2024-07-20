const { subscriptionSchema } = require("./userValidation");

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};

const validateSubscription = (req, res, next) => {
  const { error } = subscriptionSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  validateBody,
  validateSubscription,
};
