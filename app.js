const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const twilio = require('twilio')
const usersController = require("./controllers/usersController");
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

app.use(cors());
app.use(express.json());
app.use("/users", usersController);
app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.json({ index: "This is the index page" });
});

app.post('/sendSMS', async (req, res) => {
  const { to, message } = req.body
  try {
    if (Array.isArray(to)) {
      // Send group SMS
      for (const phoneNumber of to) {
        const response = await client.messages.create({
          body: message,
          from: '+18336332155',
          to: phoneNumber
        });
        console.log(`SMS sent to ${phoneNumber} successfully:`, response.sid);
      }
    } else {
      // Send single SMS
      const response = await client.messages.create({
        body: message,
        from: '+18336332155',
        to: to
      });
      console.log('SMS sent successfully:', response.sid)
    }
    return true
  } catch (error) {
    console.error('Error sending SMS:', error)
    throw error
  }
})

module.exports = app