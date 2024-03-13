
import { NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Play from './pages/Play/Play';
import Login from './components/Login/Login';
import { useContext, useEffect, useState } from 'react';
import { GlobleContext } from './context/Context';
import { Button, Modal } from 'react-bootstrap';
import TicTactToeOnline from './components/TicTactToe/TicTactToeOnline';

function App() {

  const [show, setShow] = useState<boolean>(false);

  const { userState: { isLogin, username }, userDispatch, signalRState: { signalRService, onlineUsers, message, privateRoomRequest, privateRoomInitiated }, signalRDispatch } = useContext(GlobleContext);

  const handleAccept = () => {
    setShow(false);
    signalRService?.createPrivateRoom({ from: username, to: message.from, content: 'Accepted' });
    signalRDispatch({ type: 'OPEN_PRIVATE_ROOM', payload: message })
  }

  const handleReject = () => {
    setShow(false);
    signalRDispatch({ type: 'REJECT_PRIVATE_ROOM_REQUEST', payload: { from: '', to: '', content: '' } })
    signalRService?.rejectPrivateRoomRequest({ from: username, to: message.from, content: 'Reject request' });
  }

  const handleClosePrivateRoom = () => {
    signalRService?.closePrivateRoom({
      from: username,
      to: (privateRoomInitiated.accepted !== username ? privateRoomInitiated.accepted : privateRoomInitiated.requested),
      content: 'ClosePrivateRoom'
    })
  };

  useEffect(() => {
    if (privateRoomInitiated.accepted && privateRoomInitiated.requested) {
      const patner = privateRoomInitiated.accepted !== username ? privateRoomInitiated.accepted : privateRoomInitiated.requested;
      const result = onlineUsers.find(user => user.key === patner);
      if (!result) {
        alert(`${patner} Connection lost`);
        signalRDispatch({ type: 'CLOSE_PRIVATE_ROOM', payload: { from: '', to: '', content: '' } });
      }
    }
  }, [onlineUsers])

  useEffect(() => {
    if (privateRoomRequest) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [privateRoomRequest]);

  useEffect(() => {
    if (message.content === 'UserLogout' && message.from === username) {
      userDispatch({ type: 'LOGOUT', payload: null });
      signalRService?.removeUserCnnection();
      signalRDispatch({ type: 'REMOVE_SIGNALR_CONNECTION', payload: null });
    }else if(message.content === 'UserLogout' && message.to === username){
      alert(`${message.from} is logged out`);
    }else if( message.content === 'ClosePrivateRoom' && message.from !== username){
      alert(`${message.from} is closed the private room`);
    }
  }, [message])

  return (
    <div className="App">
      <Header />
      <div>
        {
          privateRoomInitiated.accepted && privateRoomInitiated.requested ?
            <div className='d-flex flex-column align-items-center'>
              <div className='mt-2'><h2>In A private Room {privateRoomInitiated.accepted} - {privateRoomInitiated.requested}</h2></div>
              <div style={{ width: '40vw', height: '70vh', display: 'flex' }}>
                <TicTactToeOnline />
              </div>
              <Button onClick={handleClosePrivateRoom}>Close Private Room</Button>
            </div>
            :
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Login register={true} />} />
              <Route path='/play' element={isLogin ? <Play /> :
                <div>
                  <h2>Please Login to play Online Or
                    <NavLink to={'/'}> Go to Home for the Single Player</NavLink>
                  </h2>
                </div>
              } />
            </Routes>
        }
      </div>
      <Modal show={show} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>{message.from} is Requesting to play online</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Accept for online play or reject the request
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleReject}>Reject</Button>
          <Button variant='primary' onClick={handleAccept}>Accept</Button>
        </Modal.Footer>
      </Modal>
      <footer className='py-1'>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
