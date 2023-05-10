const ControllerException = require("../utils/ControllerException");
const knex = require("../database/db_config");

// create toy 
exports.createToy = async ({ name, price, description, firm, producing_country, photo_id, model_id, group_id }) => {
  try {
    const [{ id: toyId }] = await knex("toys")
      .insert([{ name, price, description, firm, producing_country, photo_id, model_id, group_id }])
      .returning("id");
    return { toyId };
  } catch (error) {
    console.log(error)
    throw new ControllerException("ERROR", "Code execution error");
  }
};

exports.updateToy = async ({ toyId, name, price, description, firm, producing_country, photo_id, model_id, group_id }) => {
  try {
    const record = await knex("toys")
      .update({
        name,
        price,
        description,
        firm,
        producing_country,
        photo_id,
        model_id,
        group_id
      })
      .select("id")
      .where({ id: toyId });
    if (!record) {
      throw new ControllerException("NOT_FOUND", "Toy has not been found");
    }
    return record;
  } catch (error) {
    console.log(error);
  }
};

// delete toy 
exports.deleteToy = async ({ toyId }) => {
  const record = await knex("toys").select("id").where({ id: toyId });

  if (!record) {
    throw new ControllerException("NOT_FOUND", "Toy has not been found");
  }

  await knex("toys").where({ id: toyId }).del();

  return { message: "Toy is deleted" };
};

// get toy by id 
exports.getToyById = async ({ toyId }) => {
  const [record] = await knex("toys")
    .select("id", "name", "price", "description", "firm", "producing_country", "photo_id", "model_id", "group_id")
    .where({ id: toyId });
  if (!record) {
    throw new ControllerException("NOT_FOUND", "Toy has not been found");
  }
  return record;
};

exports.getToyHavingId = async ({ toyId }) => {
  const records = await knex("toys")
    .select("id", "name", "price", "description", "firm", "producing_country", "photo_id", "model_id", "group_id")
    .whereIn('id', toyId);
  if (!records) {
    throw new ControllerException("NOT_FOUND", "Toy has not been found");
  }
  return records;
};

// get all exists toys 
exports.getToysList = async (limit, offset) => {
  const records = await knex("toys")
    .limit(limit)
    .offset(offset);
  if (!records) {
    throw new ControllerException("NOT_FOUND", "Toy has not been found");
  }

  return records;
};
