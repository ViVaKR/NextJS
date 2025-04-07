export interface IChatMessage {
    roomId: number;
    userId: string;
    userName: string;
    avata: string;
    message: string;
    sendTime: Date;
}
