const service = require("../service/index");

const get = async (req, res, next) => {
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const userId = req.user._id;

  const filter = { owner: userId };
  if (favorite !== undefined) {
    filter.favorite = favorite === "true";
  }

  try {
    const results = await service.getAllContacts(filter, skip, limit);
    res.json({
      status: "sucess",
      code: 200,
      data: { contacts: results },
    });
  } catch (error) {
    console.error("Error fetching contacts: ", error);
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const result = await service.getContactById(userId, id);
    if (result) {
      res.json({
        status: "sucess",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Contact with id: ${id} not found`,
        data: "Not Found",
      });
    }
  } catch (error) {
    console.error("Error finding contact: ", error);
    next(error);
  }
};

const create = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const userId = req.user._id;
  try {
    const result = await service.createContact(userId, { name, email, phone });
    res.status(201).json({
      status: "sucess",
      code: 201,
      data: { contact: result },
    });
  } catch (error) {
    console.error("Error adding contact: ", error);
    next(error);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const userId = req.user._id;
  try {
    const result = await service.updateContact(userId, id, {
      name,
      email,
      phone,
    });
    if (result) {
      res.json({
        status: "sucess",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Contact with id: ${id} not found`,
        data: "Not Found",
      });
    }
  } catch (error) {
    console.error("Error updating contact: ", error);
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;
  const userId = req.user._id;

  if (favorite === undefined) {
    return res.status(400).json({
      message: "Missing field favorite",
    });
  }

  try {
    const result = await service.updateContact(userId, id, { favorite });
    if (result) {
      res.json({
        status: "sucess",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Contact with id: ${id} not found`,
        data: "Not Found",
      });
    }
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const result = await service.removeContact(userId, id);
    if (result) {
      res.json({
        status: "sucess",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Contact with id: ${id} not found`,
        data: "Not Found",
      });
    }
  } catch (error) {
    console.error("Error removing contact: ", error);
    next(error);
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  updateStatus,
  remove,
};
