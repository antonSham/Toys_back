const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

// add 
/**
 * 
 * @param {string} model_path
 * @returns 
 */
exports.createModel = async ({ model_path }) => {
  try {
    const [{ id: modelId }] = await knex("models")
      .insert([{ model_path }])
      .returning("id");
    return { modelId };
  }
  catch (error) {
    console.log(error)
    throw new ControllerException("ERROR", "something went wrong");
  }
};

// update 
exports.updateModel = async ({ model_path }) => {
  try {
    const record = await knex("models")
      .update({
        model_path
      })
      .where({ id: modelId });
    if (!record) {
      throw new ControllerException("NOT_FOUND", "Model has not been found");
    }
    return { record, message: "Model is updated" };
  } catch (error) {
    console.log(error);
    throw new ControllerException("ERROR", "something went wrong");
  }
};

// get by id 
exports.getModelById = async ({ modelId }) => {
  const [record] = await knex("models")
    .select("id", "model_path")
    .where({ id: modelId });
  if (!record) {
    throw new ControllerException("NOT_FOUND", "Model has not been found");
  }
  return record;
};

// get list 
exports.listModelById = async (limit, offset) => {
  const [record] = await knex("models")
    .select("*")
    .limit(limit)
    .offset(offset);
  if (!record) {
    throw new ControllerException("NOT_FOUND", "Models have not been found");
  }
  return record;
};

// delete 
exports.deleteModel = async ({ modelId }) => {
  const record = await knex("models").select("id").where({ id: modelId });

  if (!record) {
    throw new ControllerException("NOT_FOUND", "Model has not been found");
  }

  await knex("models").where({ id: orderId }).del();

  return { message: "model is deleted" };
};
