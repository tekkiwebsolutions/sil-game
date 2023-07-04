import React, { useContext } from 'react'
import { UserContext } from '../context/auth/userContext';

const GameOverPopup = () => {
  const { userState, startGame } = useContext(UserContext);





  return (
    <>
      <div className='game_popup_wrrpr'>
        <div className='game_popup_overlay'></div>
        <div className='game_popup_dv1'>
          <div className='game_popup_dv2'>

            <div className='game_popup_header'>
              <h3 className='title'>Our Bhabi is declared</h3>
              <h3 className='title2'>Room Name - {userState.room.room_name}</h3>

            </div>

            <div className='game_popup_body'>
              <ul className="list">
                <li className={userState.current_user.host ? 'its_my_host' : null}>
                  <img className='list-item-image' src={userState.current_user.userimage} alt={userState.current_user.username} />
                  <h4 className="list-item-content">{userState.current_user.username}</h4>
                </li>
              </ul>
            </div>


            <div className='game_popup_footer'>
              <button className='btn'>Restart match</button>
            </div>



          </div>
        </div>
      </div>
    </>
  )
}

export default GameOverPopup