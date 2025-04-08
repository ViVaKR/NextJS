import { IChatUser } from "./i-chat-user";
import { IPlayChat } from "./i-play-chat";

export interface IChatRoom {

    roomId: number;
    roomName: string;
    description: string;
    chatUsers: IChatUser[];
    playChat: IPlayChat;
}
