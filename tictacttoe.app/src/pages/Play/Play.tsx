import React, { useContext } from 'react'
import { GlobleContext } from '../../context/Context'
import { Button } from 'react-bootstrap';

const Play: React.FC = () => {
  const { userState: { username }, signalRState: { signalRService, onlineUsers } } = useContext(GlobleContext);

  const handleOnlineUsers = () => {
    return onlineUsers.filter(user => user.key !== username);
  }

  const handlePrivateRoomRequest = (user: string)=> {
    signalRService?.privateRoomRequest({from:username,to:user,content:'Private Room Request'});
  }

  return (
    <div className='container'>
      {
        handleOnlineUsers().length > 0 ?
          <>
            <h1>Online Users</h1>
            <ol className='list-group list-group-numbered'>
              {
                handleOnlineUsers().map((user, index) =>
                  <li className='list-group-item d-flex justify-content-between align-items-start'
                    key={index}>
                    <div className='ms-2 me-auto'>
                      <div className='fw-bold'>{user.key}</div>
                      {
                        user.value ? 
                        <span className='fw-bold' style={{color:'#ff2200'}}>In a private Room</span> : 
                        <span className='fw-bold' style={{color:'#6fff00'}}>Online</span>
                      }
                    </div>
                    <Button disabled={user.value} className='fs-5 fw-bold' onClick={() => handlePrivateRoomRequest(user.key)}>Play</Button>
                  </li>)
              }
            </ol>
          </> :
          <><h3>There is no online users to play please wait....</h3></>
      }
    </div>
  )
}

export default Play