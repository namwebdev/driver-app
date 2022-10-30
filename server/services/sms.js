const accountSID = "ACc74c4d2abcf12bf6d410a0c4a7a19778";
const authToken = "a6be65c40ba0cb58c6a3ee3f42982226";
const messagingServiceSid = "MGbd595712ea6e00941a47fc4f54588730";

// const accountSID = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const messagingServiceSid = process.env.TWILIO_MESSAGE_SERVICE_SID;

const client = require("twilio")(accountSID, authToken);

const sendSMS = (phoneNumber, message) => {
  const phone = "+84" + phoneNumber.substring(1);
  client.messages
    .create({
      body: message,
      messagingServiceSid,
      to: phone,
    })
    .then((message) => console.log("Send SMS successfully"))
    .done();
};

module.exports = { sendSMS };
