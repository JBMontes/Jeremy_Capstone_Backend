const db = require("../db/dbConfig");

const getUserByPhoneNumber = async (phone_number) => {

    const user = await db.oneOrNone(
      "SELECT * FROM users WHERE phone_number=$1",
      phone_number
    );
    return user;

};

const createVillageUser = async (user_id, village_id, is_admin) => {

    const villageUser = await db.one(
      "INSERT INTO village_users (user_id, village_id, is_admin) VALUES ($1, $2, $3) RETURNING *",
      [user_id, village_id, is_admin]
    );
    return villageUser;

};

const getUsersByVillageId = async (village_id) => {
 
    const users = await db.any(
      "SELECT * FROM village_users WHERE village_id=$1",
      village_id
    );
    return users;
 
};

const updateVillageUser = async (village_user_id, is_admin) => {

    const updatedUser = await db.oneOrNone(
      "UPDATE village_users SET is_admin=$1 WHERE user_id=$2 RETURNING *",
      [is_admin, village_user_id]
    );
    return updatedUser;

};

const deleteVillageUser = async (village_user_id) => {

    const deletedUser = await db.oneOrNone(
      "DELETE FROM village_users WHERE user_id=$1 RETURNING *",
      village_user_id
    );
    return deletedUser;
 
};

const getVillageUser = async (village_id, user_id) => {

    const villageUser = await db.one(
      "SELECT * FROM village_users WHERE village_id=$1 AND user_id=$2",
      [village_id, user_id]
    );
    return villageUser;

};

module.exports = {
  createVillageUser,
  getVillageUser,
  getUserByPhoneNumber,
  getUsersByVillageId,
  updateVillageUser,
  deleteVillageUser,
};
