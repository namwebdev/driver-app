const accountSID = "ACc74c4d2abcf12bf6d410a0c4a7a19778";
const authToken = "a4282d5952f4669a627aa0922ffc6a42";
const messagingServiceSid = "MGbd595712ea6e00941a47fc4f54588730";

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
