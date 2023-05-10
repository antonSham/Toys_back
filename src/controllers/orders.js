const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

// add a new order 
exports.createOrder = async ({ user_id, toys, price }) => {
  try {
    const [{ id: orderId }] = await knex("orders")
      .insert([{ user_id, price }])
      .returning("id");
    toys.forEach(async ({ id: toy_id, amount }) => {
      await knex("orders_toys")
        .insert([{ order_id: orderId, toy_id, amount }])
    });
    return { orderId, message: "Order is created" };
  }
  catch (error) {
    console.log(error)
    throw new ControllerException("ERROR", "something went wrong");
  }
};

// update an order 
exports.updateOrder = async ({ users_id, price }) => {
  try {
    const [record] = await knex("orders")
      .update({ users_id, price })
      .where({ id: orderId });
    if (!record) {
      throw new ControllerException("NOT_FOUND", "Order has not been found");
    }
    return { record, message: "Order is updated" };
  } catch (error) {
    console.log(error);
    throw new ControllerException("ERROR", "something went wrong");
  }
};

// get an order by id 
exports.getOrderById = async ({ orderId }) => {
  const [{ id, users_id, price }] = await knex("orders")
    .select("id", "users_id", "price")
    .where({ id: orderId });

  return { id, users_id, toys, amount, price };
};

// get list orders
exports.getOrders = async (limit, offset) => {
  const records = await knex("orders")
    .select("*")
    .limit(limit)
    .offset(offset);
  if (!records) {
    throw new ControllerException("NOT_FOUND", "Orders have not been found");
  }

  return records;
};

// delete an order 
exports.deleteOrder = async ({ orderId }) => {
  const record = await knex("orders").select("id").where({ id: orderId });

  if (!record) {
    throw new ControllerException("NOT_FOUND", "Order has not been found");
  }

  await knex("orders").where({ id: orderId }).del();

  return { message: "Order is deleted" };
};
