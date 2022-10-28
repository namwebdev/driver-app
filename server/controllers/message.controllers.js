const Message = require("../models/message.js");
const _Chat = require("../models/chat.js");

const create = async (req, res) => {
  const { chat, content } = req.body;
  const message = await Message.create({ user: req.user, chat, content });
  const doc = await _Chat.findOneAndUpdate(
    { _id: message.chat },
    { updated_at: Date.now() }
  );
  message.user = message.user._id;
  res.status(201).send(message);
};

const getByChat = async (req, res) => {
  const { chat } = req.query;
  if (!chat) {
    res.status(400).send({ message: "Chat is required." });
    return;
  }
  const chats = await Message.find({ chat });
  res.status(200).send({ data: chats });
};

module.exports = { create, getByChat };
