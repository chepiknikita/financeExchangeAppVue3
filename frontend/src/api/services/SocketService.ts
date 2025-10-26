import { io, Socket } from "socket.io-client";
import { ref } from "vue";

const SOCKET_URL = import.meta.env.VITE_SERVER_SOCKET_URL || "http://localhost:8080";

const optiosn = {
  autoConnect: false,
};

const socket: { assets: Socket, exchange: Socket } = {
  assets: io(`${SOCKET_URL}/assets`, optiosn),
  exchange: io(`${SOCKET_URL}/exchange`, optiosn),
}

const isConnected = ref(false);

export const useSocket = () => {
  const connect = (token: string) => {
    // socket.assets.auth = { token };
    socket.assets.connect();
    isConnected.value = true;
  };

  const disconnect = () => {
    socket.assets.disconnect();
    isConnected.value = false;
  };

  return {
    socket,
    isConnected,
    connect,
    disconnect,
  };
};
