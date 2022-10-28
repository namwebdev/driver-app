const Chat = require("../models/chat.js");
const _Message = require("../models/message.js");
const _User = require("../models/user.js");

const create = async (req, res) => {
  const { name, users: usersData } = req.body;
  const { _id: id } = req.user;
  const users = [...usersData, id];
  const isChatExist = await Chat.findOne({ users });
  if (isChatExist) {
    res.status(400).send({ message: "Chat already exists" });
    return;
  }
  const chat = await Chat.create({ name, users });
  res.status(201).send({ chat });
};

const getByUser = async (req, res) => {
  const { _id } = req.user;
  const chats = await Chat.find({ users: _id })
    .populate("users", "-password -friends")
    .sort({ updated_at: -1 });
  for await (const chat of chats) {
    const lastest_message = await _Message
      .findOne({ chat: chat._id })
      .sort({ _id: -1 })
      .select("user content");
    chat.lastest_message = lastest_message;
  }

  res.status(200).json({ chat: chats });
};

module.exports = { create, getByUser };
