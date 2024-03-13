import React, { ReactNode, createContext, useEffect, useReducer } from 'react';
import { Action, SignalRState, UserState } from './types';
import { signalRConnectionReducer, userControlReducer } from './Reducer';
import { SignalRService } from '../services/SignalrService';

interface GlobalStateProps {
    children: ReactNode;
}

const initialUserState: UserState = {
    isLogin: false,
    username: '',
    accessToken:'',
    refreshToken:''
}

const initialSignalRStatus: SignalRState = {
    signalRService: null,
    onlineUsers:[],
    privateRoomRequest:false,
    privateRoomInitiated:{requested:'',accepted:''},
    message:{from:'',to:'',content:''},
    privateRoomMsg:{from:'',to:'',position:0}
}


export const GlobleContext = createContext<{
    userState: UserState;
    userDispatch: React.Dispatch<Action>;
    signalRState: SignalRState;
    signalRDispatch: React.Dispatch<Action>;
}>({
    userState: initialUserState,
    userDispatch: () => undefined,
    signalRState: initialSignalRStatus,
    signalRDispatch: () => undefined
});

const GlobleState : React.FC<GlobalStateProps> = ({children}) => {
    const [userState, userDispatch] = useReducer(userControlReducer, initialUserState);
    const [signalRState, signalRDispatch] = useReducer(signalRConnectionReducer, initialSignalRStatus)

    let refreshInterval: NodeJS.Timer | null;

    const checkTokenExpiration = () => {
        if(userState.accessToken){
            if(!refreshInterval){ // if not defined
                refreshInterval = setInterval(refreshToken,100000); // callback every 100s
                startSignalRConnection(); // After user loged in call this function
            }
        }
    }

    const startSignalRConnection = () => {
        const signalRService = new SignalRService(userState.username, signalRDispatch);
        signalRService.createUserRoomConnection();
        signalRDispatch({type:'SET_SIGNALR_SERVICE', payload:signalRService});
    }

    const refreshToken = () => {
        const jwtToken = localStorage.getItem('jwtToken');
        if(jwtToken) {
            const decoded = decodeJwt(jwtToken);
            if(decoded.exp * 1000 > Date.now()){
                fetchRefreshToken();
            }else{
                userDispatch({type:'LOGOUT', payload: null});
                signalRDispatch({type:'REMOVE_SIGNALR_CONNECTION', payload:null})
                if(refreshInterval)
                    clearInterval(refreshInterval);
            }
        }
    }

    const decodeJwt = (token: string) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-','+').replace('_','/');
        return JSON.parse(atob(base64));
    }

    const fetchRefreshToken = async () => {
        const jwtToken = localStorage.getItem('jwtToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            const result = await fetch(process.env.REACT_APP_API_URL+"api/User/refresh",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    accessToken: jwtToken,
                    refreshToken: refreshToken
                })
            }).then(res => res.json());

            if(result.accessToken){
                localStorage.setItem('jwtToken', result.accessToken);
                localStorage.setItem('refreshToken', result.refreshToken);
                userDispatch({type:'REFRESH_TOKEN', payload: {accessToken:result.accessToken,refreshToken:result.refreshToken}});
            }

        } catch (error) {
            // alert(error);
            console.log(error);
        }
    }

    useEffect(()=>{
        if(userState.isLogin)
            checkTokenExpiration();
    },[userState.isLogin])

  return (
    <GlobleContext.Provider value={{userState, userDispatch, signalRState, signalRDispatch}}>{children}</GlobleContext.Provider>
  )
}

export default GlobleState