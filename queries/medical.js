const db = require("../db/dbConfig");

const getMedicals = async (user_id) => {

    const medicals = await db.any(
      "SELECT * FROM medical WHERE user_id=$1",
      user_id
    );
    return medicals;
 
};

const getMedical = async (id, user_id) => {

    const oneMedical = await db.oneOrNone(
      "SELECT * FROM medical WHERE medical_id=$1 AND user_id=$2",
      [id, user_id]
    );
    return oneMedical;

};

const newMedical = async (medical) => {

    const { medical_history, blood_type, allergies, medication, user_id } =
      medical;
    const newMedical = await db.oneOrNone(
      "INSERT INTO medical (medical_history, blood_type, allergies, medication, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [medical_history, blood_type, allergies, medication, user_id]
    );
    return newMedical;

};

const deleteMedical = async (id) => {

    const deletedMedical = await db.none(
      "DELETE FROM medical WHERE medical_id=$1 RETURNING *",
      id
    );
    return deletedMedical;
 
};

const updateMedical = async (id, medical) => {
  const { medical_history, blood_type, allergies, medication } = medical;

    const updatedMedical = await db.oneOrNone(
      "UPDATE medical SET medical_history=$1, blood_type=$2, allergies=$3, medication=$4 WHERE medical_id=$5 ",
      [medical_history, blood_type, allergies, medication, id]
    );
    return updatedMedical;

};

module.exports = {
  getMedicals,
  getMedical,
  newMedical,
  deleteMedical,
  updateMedical,
};
