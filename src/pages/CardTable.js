import React, { useState, useContext, } from 'react'
import '../CardTable.css';
import BhabiLogo from '../img/logo.svg'
import CardBack from '../img/card_back.jpg'
import { UserContext } from '../context/auth/userContext';
import Loader1 from '../components/Loader1';


const CardTable = () => {

  const { userState, startGame, playCard } = useContext(UserContext);

  const [timerTracker] = useState(0);






  // const startTimerTracker = () => {
  //   let interval = null;
  //   interval = setInterval(() => {
  //     setTimerTracker((timerTracker) => timerTracker + 10);
  //   }, 10);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }

  // const sendMessageToWebsocket = useCallback((command, data) => sendMessage(JSON.stringify({
  //   command: command,
  //   ...data
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // })), []);

  // const getCardNumber = (number) => {
  //   if (number === "14") {
  //     return 'A';
  //   } else if (number === "11") {
  //     return 'J';
  //   } else if (number === "12") {
  //     return 'Q';
  //   } else if (number === "13") {
  //     return 'K';
  //   } else {
  //     return number;
  //   }
  // }


  if (userState.loading) {
    return (
      <Loader1 />
    )
  }


  return (
    <>
      <div className={`table_container ${userState.room.status === 'waiting' ? "unactive_table" : null}`}>




        <img className='main_logo' src={BhabiLogo} alt="logo" />






        <div className="table">

          <img className='logo' src={BhabiLogo} alt="logo" />

          {userState.room.current_cards_on_table.length ? <>
            <div className="card-place">
              {userState.room.current_cards_on_table.map((item, index) => {
                return (
                  <div key={index} className="card">
                    <h1>{item.rank}</h1>
                    <div className={`figures ${item.suit === "♥" ? "hearts" : item.suit === "♦" ? "diamonds" : item.suit === "♣" ? "clubs" : "spades"}`}></div>
                    <h1>{item.rank}</h1>
                  </div>
                )
              })}

            </div>
          </> : <>
            <div className="card-place">

              <ul className='card_back_wrrpr'>
                <li className='card card_back'>
                  <img src={CardBack} alt="" />
                </li>
              </ul>

            </div>
          </>}

          <div className="players">
            {userState.room.users.map((item, index) => {
              return (
                <div key={index} className={`player player-${index + 1} ${userState.room.status !== 'waiting' && item.user_id === userState.room.turn ? "playing": ''}`}>
                  <div className={`avatar ${userState.current_user.user_id === item.user_id ? 'my_user' : ''}`}>
                    <img src={item.userimage} alt={item.username} />
                  </div>
                  <div className="name">{item.username}</div>
                </div>

              )
            })}
          </div>

        </div>
















        <div className='time_tracker'>
          <h3>Game Time : {("0" + Math.floor((timerTracker / 60000) % 60)).slice(-2)}:{("0" + Math.floor((timerTracker / 1000) % 60)).slice(-2)}</h3>
        </div>























        <div className="list-wrapper">
          <ul className="list">

            {userState.room.users.map((item, index) => {
              return (
                <li key={index} className={`list-item ${item.status === 'Watching' ? 'watching' : ''} ${userState.current_user.user_id === item.user_id ? 'my_user' : ''}`} style={{ order: `${item.status === 'Watching' ? '1' : '-' + item.number_cards_in_hand}` }}>
                  <div>
                    <img src={item.userimage} className="list-item-image" alt={item.username} />
                  </div>
                  <div className="list-item-content">
                    <h4>{item.username}</h4>

                    <p className={`user_chat ${item.status === 'playing' ? 'playing' : item.status === 'out' ? 'out' : item.status === 'Watching' ? 'watching' : ''}`}>{item.status}</p>

                    {item.number_cards_in_hand === 0 ? '' : <p className='in_hand_cards'>Cards in Hand {item.number_cards_in_hand}</p>}
                  </div>
                </li>
              )
            })}


          </ul>
        </div>






















        <div className='my_cards_wrrpr'>
          <div className="card-place">






            {userState.room.status !== 'waiting' && userState.room.users.filter((e) => e.user_id === userState.current_user.user_id)[0].cards_in_hand.map((item, index) => {
              return (
                <div key={index} className={`card_dv ${userState.room.current_cards_on_table.length > 0 && userState.room.current_cards_on_table[0].suit !== item.suit ? 'disabled' : ''}`} onClick={() => {
                  console.log('AAAA');
                  if (userState.current_user.user_id === userState.room.turn) {
                    if (userState.room.current_cards_on_table.length > 0 && userState.room.current_cards_on_table[0].suit !== item.suit) {
                      return;
                    }
                    item.user_id = userState.current_user.user_id;
                    playCard(item);
                  }
                }}>
                  <div className="card">
                    <h1>{item.rank}</h1>
                    <div className={`figures ${item.suit === "♥" ? "hearts" : item.suit === "♦" ? "diamonds" : item.suit === "♣" ? "clubs" : "spades"}`}></div>
                    <h1>{item.rank}</h1>
                  </div>
                </div>
              )
            })}










          </div>
        </div>










      </div>






      {/* Game Popup */}

      {console.log(userState)}

      {userState.room.status === 'waiting' ? <>
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
      </> : null}








    </>
  )
}

export default CardTable;