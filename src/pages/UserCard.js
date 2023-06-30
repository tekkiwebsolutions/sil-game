import React from 'react'

const UserCard = ({
  index,
  item,
  userState
}) => {
  return (
    <li key={index} className={`list-item ${item.status === 'Watching' ? 'watching' : ''} ${userState.current_user.user_id === item.user_id ? 'my_user' : ''}`} style={{ order: `${item.status === 'Watching' ? '1' : '-' + item.number_cards_in_hand}` }}>
      <div className='list-item-image-dv'>
        <img src={item.userimage} className="list-item-image" alt={item.username} />
      </div>
      <div className="list-item-content">
        <h4>{item.username}</h4>

        {/* <p className={`user_chat ${item.status === 'playing' ? 'playing' : item.status === 'out' ? 'out' : item.status === 'Watching' ? 'watching' : ''}`}>{item.status}</p> */}

        {/* {item.number_cards_in_hand === 0 ? '' : <p className='in_hand_cards'>Cards in Hand {item.number_cards_in_hand}</p>} */}
      </div>
    </li>
  )
}

export default UserCard