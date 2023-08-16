import socketIOClient from "socket.io-client";
import { ChannelModel } from "../types/chat/channelTypes";
import { useAppSelector } from "../utils/redux-hooks";
import { emptyChannel } from "../data/emptyChannel";
import { selectDisplayedChannel } from "../redux-features/chat/channelsSlice";

// Create the socket instance here and export it
const createSocketInstance = (roomId: string) => {
  const socket = socketIOClient("http://localhost:4002", {
    query: { roomId }
  });

  return socket;
};

export const useSocket = () => {
  const selectedChannel: ChannelModel = useAppSelector((state) =>
    selectDisplayedChannel(state)
  ) || emptyChannel;

  if (selectedChannel.name === "WelcomeChannel" || selectedChannel.name === "empty channel") {
    return null; // Return null if the channel is not valid
  }

  const roomId: string = selectedChannel.name;
  const socket = createSocketInstance(roomId);

  return socket;
};
