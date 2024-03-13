import { Action, SignalRState, UserState } from "./types";


export const userControlReducer = (state:UserState,action:Action) : UserState=> {
    switch (action.type) {
        case 'LOGIN':
            return {...state, 
                isLogin:true ,
                username:action.payload.username,
                accessToken:action.payload.accessToken,
                refreshToken:action.payload.refreshToken
            };
        case 'LOGOUT':
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('refreshToken');
            return {...state, isLogin:false, username:""};
        case 'REFRESH_TOKEN':
            return {...state, accessToken: action.payload.accessToken, refreshToken:action.payload.refreshToken};
        default:
            return state;
    }
}

export const signalRConnectionReducer = (state:SignalRState, action:Action) : SignalRState => {
    switch (action.type){
        case 'SET_SIGNALR_SERVICE':
            return { ...state, signalRService: action.payload};
        case 'REMOVE_SIGNALR_CONNECTION':
            return {...state, 
                signalRService:null, 
                privateRoomRequest:false, 
                privateRoomInitiated:{requested:'', accepted:''}, 
                privateRoomMsg:{from:'',to:'',position:0}};
        case 'SET_ONLINE_USERS':
            return {...state, onlineUsers:action.payload};
        case 'REQUEST_PRIVATE_ROOM':
            return {...state, privateRoomRequest:true,message:action.payload};
        case 'REJECT_PRIVATE_ROOM_REQUEST':
            return {...state,privateRoomRequest:false,message:action.payload};
        case 'OPEN_PRIVATE_ROOM':
            return {...state,privateRoomInitiated:{requested:action.payload.from, accepted:action.payload.to}};
        case 'CLOSE_PRIVATE_ROOM':
            return {...state,
                privateRoomRequest:false,
                privateRoomInitiated:{requested:'',accepted:''}, 
                message:action.payload, 
                privateRoomMsg:{from:'',to:'',position:0}};
        case 'PRIVATE_ROOM_MESSAGE':
            return {...state, privateRoomMsg: action.payload}
        default:
            return state;
    }
}