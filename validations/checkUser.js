const db = require("../db/dbConfig");

const checkRequiredFields = (req, res, next) => {
    const { name, username, password_hash, email, phone_number } = req.body
    if (name && username && password_hash && email && phone_number) {
        next()
    } else {
        res.status(400).json({ error: "All required fields must be provided" })
    }
}

const validateEmail = (req, res, next) => {
    const { email } = req.body
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(email)) {
        next()
    } else {
        res.status(400).json({ error: "Invalid email format" })
    }
}

const validatePhoneNumber = (req, res, next) => {
    const { phone_number } = req.body
    const sanitizedPhoneNumber = phone_number.replace(/\D/g, '')

    if (sanitizedPhoneNumber.length >= 10) {
        next()
    } else {
        res.status(400).json({ error: "Invalid phone number format" })
    }
}

const validateLoginInput = (req, res, next) => {
    const { username, password_hash } = req.body
    if (!username || !password_hash) {
        res.status(400).json({ error: "Username and password are required" })
    } else {
        next()
    }
}

const checkDuplicateUsername = async (req, res, next) => {
    const { username } = req.body
    try {
        const existingUser = await db.oneOrNone(
            "SELECT * FROM users WHERE LOWER(username) = LOWER($1)",
            username
        )
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" })
        }
        next()
    } catch (err) {
        console.error("Error checking duplicate username:", err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

const checkDuplicateEmail = async (req, res, next) => {
    const { email } = req.body
    try {
        const existingUser = await db.oneOrNone(
            "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
            email
        )
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered" })
        }
        next()
    } catch (err) {
        console.error("Error checking duplicate email:", err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

const checkDuplicatePhoneNumber = async (req, res, next) => {
    const { phone_number } = req.body
    try {
        const existingUser = await db.oneOrNone(
            "SELECT * FROM users WHERE phone_number = $1",
            phone_number
        )
        if (existingUser) {
            return res.status(400).json({ error: "Phone number is already registered" })
        }
        next()
    } catch (err) {
        console.error("Error checking duplicate phone number:", err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
};

const isValidId = (req, res, next) => {
    const {id} = req.params
    const idAsNum = Number(id);

    if(!Number.isInteger(idAsNum) && idAsNum <= 0){
        return res.status(400).json({error: `ID: ${id} must be a positive number.`})
    }
    req.id = idAsNum
    next()
  };

module.exports = {
    checkRequiredFields,
    validateEmail,
    validatePhoneNumber,
    validateLoginInput,
    checkDuplicateEmail,
    checkDuplicateUsername,
    checkDuplicatePhoneNumber,
    isValidId
}