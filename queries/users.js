const db = require("../db/dbConfig");
const bcrypt = require("bcrypt");

// for development purposes only
const getUsers = async () => {

    const users = await db.any("SELECT * FROM users");
    return users;
  
};

const getUser = async (id) => {

    const user = await db.one("SELECT * FROM users WHERE user_id=$1", id);
    return user;

};

const createUser = async (user) => {

    const { name, username, password_hash, email, phone_number, profile_picture_url } =
      user;
    const salt = 10;
    const hash = await bcrypt.hash(password_hash, salt);
    const profilePic = profile_picture_url
      ? profile_picture_url
      : "/static/default_profile_pic.webp";
    const newUser = await db.one(
      "INSERT INTO users (name, username, password_hash, email, phone_number, profile_picture_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, username, hash, email, phone_number, profilePic]
    );
    return newUser;
  
};

const logInUser = async (user) => {

    const loggedInUser = await db.oneOrNone(
      "SELECT * FROM users WHERE username=$1",
      user.username
    );
    if (!loggedInUser) return false;
    const passwordMatch = await bcrypt.compare(
      user.password_hash,
      loggedInUser.password_hash
    );
    if (!passwordMatch) return false;
    return loggedInUser;
 
};

const updateUser = async (id, updatedUser) => {
  const { password_hash } = updatedUser
  if (password_hash) {
   
      const { name, username, password_hash, email, phone_number, profile_picture_url } =
        updatedUser;
      const salt = 10;
      const hash = await bcrypt.hash(password_hash, salt);
      const profilePic = profile_picture_url
        ? profile_picture_url
        : "/static/default_profile_pic.webp";
      const updated = await db.none(
        "UPDATE users SET name=$1, username=$2, password_hash=$3, email=$4, phone_number=$5, profile_picture_url=$6 WHERE user_id=$7 RETURNING *",
        [name, username, hash, email, phone_number, profilePic, id]
      );
      return updated;
   
  } else {
 
      const { name, username, email, phone_number, profile_picture_url } =
        updatedUser;
      const profilePic = profile_picture_url
        ? profile_picture_url
        : "/static/default_profile_pic.webp";
      const updated = await db.none(
        "UPDATE users SET name=$1, username=$2, email=$3, phone_number=$4, profile_picture_url=$5 WHERE user_id=$6 RETURNING *",
        [name, username, email, phone_number, profilePic, id]
      );
      return updated;

  }
};

const deleteUser = async (id) => {
    const deletedUser = await db.none("DELETE FROM users WHERE user_id=$1", id);
    return deletedUser;

};

module.exports = {
  getUsers,
  getUser,
  createUser,
  logInUser,
  updateUser,
  deleteUser,
};
