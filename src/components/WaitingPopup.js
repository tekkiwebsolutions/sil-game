import React, { useContext } from 'react'
import { UserContext } from '../context/auth/userContext';

const WaitingPopup = () => {
  const { userState, startGame } = useContext(UserContext);





  return (
    <>
      <div className='game_popup_wrrpr'>
        <div className='game_popup_overlay'></div>
        <div className='game_popup_dv1'>
          <div className='game_popup_dv2'>

            <div className='game_popup_header'>
              <h3 className='title'>Wating for host to start the game</h3>
              <h3 className='title2'>Room Name - {userState.room.room_name}</h3>

            </div>

            <div className='game_popup_body'>
              <ul className="list">
                {/* {users.map((item, index) => {
                    return (
                      <li key={index} className={item.host ? 'its_my_host' : null}>
                        <img className='list-item-image' src={item.user_image} alt={item.username} />
                        <h4 className="list-item-content">{item.username}</h4>
                      </li>
                    )
                  })} */}
                <li className={userState.current_user.host ? 'its_my_host' : null}>
                  <img className='list-item-image' src={userState.current_user.userimage} alt={userState.current_user.username} />
                  <h4 className="list-item-content">{userState.current_user.username}</h4>
                </li>

              </ul>
            </div>


            {
              userState.room.host === userState.current_user.user_id ? <>
                <div className='game_popup_footer'>
                  <button className='btn' onClick={() => { startGame() }}>Start match</button>
                </div>
              </> : null
            }



          </div>
        </div>
      </div>
    </>
  )
}

export default WaitingPopup