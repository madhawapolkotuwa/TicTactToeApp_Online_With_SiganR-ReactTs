import React from 'react'
import Tictacttoe from '../../components/TicTactToe/Tictacttoe'

const Home: React.FC = () => {
  return (
    <div className='d-flex justify-content-around align-items-center home'>
      <div>
        Home
      </div>
      <div style={{ width: '40vw', height: '70vh', display: 'flex' }}>
        <Tictacttoe />
      </div>
    </div>
  )
}

export default Home