import { SignalRService } from "../services/SignalrService";


export interface UserState {
    isLogin: boolean;
    username: string;
    accessToken: string;
    refreshToken:string;
}

export interface Action {
    type:string;
    payload: any;
}

export interface SignalRState {
    signalRService: SignalRService | null;
    onlineUsers: OnlineUser[];
    privateRoomRequest: boolean;
    privateRoomInitiated:{requested:string; accepted:string}
    message:Message;
    privateRoomMsg:PrivateRoomMessage;
}

export interface Message {
    from:string;
    to:string;
    content:string;
}

export interface OnlineUser {
    key:string;
    value:boolean;
}

export interface PrivateRoomMessage {
    from:string;
    to:string;
    position:number;
}