const db = require("../db/dbConfig");

const generateVillageCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

const createVillage = async (village_name, creator_id) => {

    const village_code = generateVillageCode();
    const village = await db.oneOrNone(
      "INSERT INTO villages (village_name, village_code, creator_id) VALUES ($1, $2, $3) RETURNING *",
      [village_name, village_code, creator_id]
    );
    return village;

};

const getVillage = async (village_id) => {

    const village = await db.oneOrNone(
      "SELECT * FROM villages WHERE village_id=$1",
      village_id
    );
    return village;

};

const getAllVillages = async () => {

    const allVillages = await db.any("SELECT * FROM villages");
    return allVillages

}

const getVillages = async (user_id) => {

    const villages = await db.any(
      "SELECT DISTINCT v.* FROM villages v LEFT JOIN village_users vu ON v.village_id = vu.village_id WHERE vu.user_id = $1 OR v.creator_id = $1",
      user_id
    );
    return villages;

};

const updateVillage = async (village_id, village_name) => {

    await db.none("UPDATE villages SET village_name=$1 WHERE village_id=$2", [
      village_name,
      village_id,
    ]);
 
};

const deleteVillage = async (village_id) => {

    await db.none('DELETE FROM village_users WHERE village_id=$1', village_id)
    await db.none("DELETE FROM villages WHERE village_id=$1", village_id);

};

module.exports = {
  createVillage,
  getVillage,
  updateVillage,
  deleteVillage,
  getVillages,
  getAllVillages,
};
