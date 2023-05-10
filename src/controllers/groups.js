const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

// add 
/**
 * 
 * @param {string} group_path
 * @returns 
 */
exports.createGroup = async ({ group_path }) => {
  try {
    const [{ id: groupId }] = await knex("groups")
      .insert([{ group_path }])
      .returning("id");
    return { groupId };
  }
  catch (error) {
    console.log(error)
    throw new ControllerException("ERROR", "something went wrong");
  }
};

// update 
exports.updateGroup = async ({ group_path }) => {
  try {
    const record = await knex("groups")
      .update({
        group_path
      })
      .where({ id: groupId });
    if (!record) {
      throw new ControllerException("NOT_FOUND", "Group has not been found");
    }
    return { record, message: "Group is updated" };
  } catch (error) {
    console.log(error);
    throw new ControllerException("ERROR", "something went wrong");
  }
};

// get by id 
exports.getGroupById = async ({ groupId }) => {
  const [record] = await knex("groups")
    .select("id", "group_path")
    .where({ id: groupId });
  if (!record) {
    throw new ControllerException("NOT_FOUND", "Group has not been found");
  }
  return record;
};

// get list 
exports.listGroupById = async (limit, offset) => {
  const [record] = await knex("groups")
    .select("*")
    .limit(limit)
    .offset(offset);
  if (!record) {
    throw new ControllerException("NOT_FOUND", "Groups have not been found");
  }
  return record;
};

// delete 
exports.deleteGroup = async ({ groupId }) => {
  const record = await knex("groups").select("id").where({ id: groupId });

  if (!record) {
    throw new ControllerException("NOT_FOUND", "Group has not been found");
  }

  await knex("groups").where({ id: orderId }).del();

  return { message: "group is deleted" };
};
