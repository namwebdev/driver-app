import { io } from "socket.io-client";

class SocketIOService {
  socket;
  constructor() {}

  initialize() {
    this.socket = io(import.meta.env.VITE_SERVER_URL);
  }

  setup(user_id) {
    this.socket.emit("setup", user_id);
  }

  on(event, callback) {
    this.socket.on(event, callback);
  }

  emit(event, args) {
    this.socket.emit(event, args);
  }

  join(room_id) {
    this.socket.emit("join-room", room_id);
  }

  sendMessage(message, user_ids) {
    this.socket.emit("send-message", message, user_ids);
  }
}

export default new SocketIOService();
