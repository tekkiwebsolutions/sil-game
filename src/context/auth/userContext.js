import React, {
  useReducer,
  createContext,
  useCallback,
  useEffect
} from 'react'
// import { API } from '../../const';

import { collection, addDoc, doc, updateDoc, query, where, getDocs, onSnapshot, } from "firebase/firestore";
import { db } from "../../firebaseConfig";

import * as types from "./userReducer";
import userReducer from "./userReducer";


import { useAlert } from 'react-alert'





const initialState = {
  tempUserId: null,
  loading: true,
  room: null,
  current_user: null,
};





export const UserContext = createContext(initialState);





export const UserProvider = ({ children }) => {

  const alert = useAlert()

  const [userState, dispatch] = useReducer(userReducer, initialState);




  // eslint-disable-next-line react-hooks/exhaustive-deps
  const createRoom = useCallback(async (loginType, userImage, user_name, room_name, room_password) => {
    dispatch({ type: types.SET_LOADING, payload: true });
    if (loginType === 'create') {
      return getRoomDataFromName(room_name).then((res) => {
        if (res === undefined) {
          return addDoc(collection(db, "rooms"), {
            status: "waiting",
            room_name: room_name,
            room_password: room_password,
            host: userState.tempUserId,
            users: [
              {
                user_id: userState.tempUserId,
                username: user_name,
                userimage: userImage,
                cards_in_hand: [],
              }
            ],
            watching_users: [],
            removed_users: [],
            current_turn: null,
            current_cards_on_table: [],
          }).then((doc) => {
            console.log("Document written with ID: ", doc);

            return getRoomDataFromName(room_name).then((res) => {
              console.log(res);
              dispatch({
                type: types.SET_INITIAL_DATA_REDUCER,
                payload: res
              });
              dispatch({
                type: types.SET_USER_DATA,
                payload: {
                  user_id: userState.tempUserId,
                  username: user_name,
                  userimage: userImage,
                  cards_in_hand: [],
                }
              });
              changeRoomOnDocChange(res.id);
              dispatch({ type: types.SET_LOADING, payload: false });
              return { success: true };
            })

          }).catch((error) => {
            dispatch({ type: types.SET_LOADING, payload: false });
            alert.error('Error while creating room');
            return { success: false };
          });
        } else {
          dispatch({ type: types.SET_LOADING, payload: true });
          alert.error('Room already exists with this name');
          return { success: false };
        }
      });
    }
    else {
      return getRoomDataFromName(room_name).then((res) => {
        if (res === undefined) {
          dispatch({ type: types.SET_LOADING, payload: false });
          alert.error('Room does not exist with this name');
          return { success: false };
        } else {
          return checkPassword(room_name, room_password).then(async (response) => {
            if (response) {
              dispatch({
                type: types.SET_INITIAL_DATA_REDUCER,
                payload: res
              });
              var user = {
                user_id: userState.tempUserId,
                username: user_name,
                userimage: userImage,
                cards_in_hand: [],
              };
              dispatch({
                type: types.SET_USER_DATA,
                payload: user
              });
              if (res.status === 'waiting' && res.room.users <= 8) {
                await addUserToTheRoom(res, user, true);
              } else {
                await addUserToTheRoom(res, user, false);
              }
              changeRoomOnDocChange(res.id);
              dispatch({ type: types.SET_LOADING, payload: false });
              return { success: true };
            } else {
              dispatch({ type: types.SET_LOADING, payload: false });
              alert.error('Room exists but password is incorrect');
              return { success: false };
            }
          });
        }
      });
    }
  })


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const startGame = useCallback(async () => {
    dispatch({ type: types.SET_LOADING, payload: true });

    var cardHands = distributeCards(userState.room.users.length);

    alert.info('Cards Distributed Amoung All the players.');

    var indexOfStart = findAceOfSpadesIndex(cardHands);

    userState.room.users.forEach((user, index) => {
      user.cards_in_hand = cardHands[index];
    });

    const roomRef = doc(db, "rooms", userState.room.id);
    return updateDoc(roomRef, {
      status: "playing",
      users: userState.room.users,
      turn: userState.room.users[indexOfStart].user_id
    }).then(() => {
      dispatch({ type: types.SET_LOADING, payload: false });
      return { success: true };
    }
    ).catch((error) => {
      dispatch({ type: types.SET_LOADING, payload: false });
      console.error("Error adding document: ", error);
      return { success: false };
    }
    );
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const playCard = useCallback(async (card) => {
    // remove card from user's hand
    var user = userState.room.users.find(user => user.user_id === userState.current_user.user_id);
    var index = user.cards_in_hand.findIndex(cardInHand => cardInHand.rank === card.rank && cardInHand.suit === card.suit);
    user.cards_in_hand.splice(index, 1);

    // add card to cards on table
    var cardsOnTable = userState.room.current_cards_on_table;
    cardsOnTable.push(card);


    // update turn
    var indexOfCurrentTurn = userState.room.users.findIndex(user => user.user_id === userState.room.turn);
    var indexOfNextTurn = (indexOfCurrentTurn + 1) % userState.room.users.length;
    userState.room.turn = userState.room.users[indexOfNextTurn].user_id;


    // update room
    const roomRef = doc(db, "rooms", userState.room.id);
    return updateDoc(roomRef, {
      users: userState.room.users,
      current_cards_on_table: cardsOnTable,
      turn: userState.room.turn
    }).then(() => {

      var tholuUser = checkTholu(cardsOnTable);

      if (tholuUser !== undefined) {
        // send all cards to the user who won the tholu
        var userWhoWonTholu = userState.room.users.find(user => user.user_id === tholuUser);
        userWhoWonTholu.cards_in_hand = [...userWhoWonTholu.cards_in_hand, ...cardsOnTable, card];

        alert.info(`${userWhoWonTholu.username} Got Tholu`);

        // send user who won the tholu to the end of the users array
        var indexOfUserWhoWonTholu = userState.room.users.findIndex(user => user.user_id === tholuUser);
        userState.room.users.splice(indexOfUserWhoWonTholu, 1);
        userState.room.users.push(userWhoWonTholu);

        userState.room.turn = userWhoWonTholu.user_id;

        // update room
        const roomRef = doc(db, "rooms", userState.room.id);
        updateDoc(roomRef, {
          users: userState.room.users,
          turn: userState.room.turn,
          current_cards_on_table: [],
        })
      } else {
        // check if all users have played their cards
        if (cardsOnTable.length === userState.room.users.length) {

          userState.room.turn = getHighestCard(cardsOnTable).user_id
          
          updateDoc(roomRef, {
            current_cards_on_table: [],
            turn: userState.room.turn
          })
        }
      }

      var removed_users = userState.room.removed_users ?? [] + userState.room.users.filter((e) => e.cards_in_hand.length === 0);        
      if (removed_users.length > 0) {

        alert.info(`${removed_users[0].username} Is Out Now`);

        if (removed_users.map((e) => e.user_id).includes(userState.room.turn)) {
          var indexOfCurrentTurn = userState.room.users.findIndex(user => user.user_id === userState.room.turn);
          var indexOfNextTurn = (indexOfCurrentTurn + 1) % userState.room.users.length;
          userState.room.turn = userState.room.users[indexOfNextTurn].user_id;
        } 

        userState.room.users = userState.room.users.filter((e) => e.cards_in_hand.length !== 0);
        
        updateDoc(roomRef, {
          users: userState.room.users,
          removed_users: removed_users,
          turn: userState.room.turn
        })
      }

    }).catch((error) => {
      console.error("Error adding document: ", error);
      return { success: false };
    });
  })

  const checkTholu = (cardsOnTable) => {

    // check if the last card is of same suit as other cards
    var lastCard = cardsOnTable[cardsOnTable.length - 1];
    var cardsOfSameSuit = cardsOnTable.filter(card => card.suit === lastCard.suit);
    if (cardsOfSameSuit.length === cardsOnTable.length) {
      return undefined;
    } else {
      // add new field to the cards for value

      // exclude the last card from cards on table
      cardsOnTable.pop();

      return getHighestCard(cardsOnTable).user_id;
    }
  }

  const getHighestCard = (cards) => {
    cards.forEach(card => {
      card.value = card.rank === "A" ? 14 : card.rank === "J" ? 11 : card.rank === "Q" ? 12 : card.rank === "K" ? 13 : parseInt(card.rank);
    });
    // sort the cards by value
    cards.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
    
    // get highest card
    var highestCard = cards[cards.length - 1];
    return highestCard;
  }


  useEffect(() => {
    getRandomUserId();

    var data = {};
    try {

       data = JSON.parse(window.localStorage.getItem('MY_APP_STATE') || {});
    } catch (error) {
       data = {
        tempUserId: null,
      };
    }
    if (data.tempUserId !== null) {
      setPersistentState(data);
      changeRoomOnDocChange(data.room.id)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('MY_APP_STATE', JSON.stringify(userState));
  }, [userState]);



  const distributeCards = (numPlayers) => {

    const suits = ["♥", "♦", "♣", "♠"];
    const ranks = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];

    // Create a deck of cards
    const deck = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({
          'rank': rank,
          'suit': suit
        });
      }
    }

    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // Calculate the number of cards per player
    const numCardsPerPlayer = Math.floor(deck.length / numPlayers);

    // Distribute the cards among players
    const playerHands = [];
    let startIndex = 0;
    let endIndex = numCardsPerPlayer;
    for (let i = 0; i < numPlayers; i++) {
      playerHands.push(deck.slice(startIndex, endIndex));
      startIndex = endIndex;
      endIndex += numCardsPerPlayer;
    }

    // Distribute any remaining cards to the players
    if (deck.length % numPlayers !== 0) {
      const remainingCards = deck.slice(startIndex);
      let currentPlayer = 0;
      for (const card of remainingCards) {
        playerHands[currentPlayer].push(card);
        currentPlayer = (currentPlayer + 1) % numPlayers;
      }
    }

    return playerHands;
  }

  function findAceOfSpadesIndex(cardsArray) {
    for (let i = 0; i < cardsArray.length; i++) {
      const playerHand = cardsArray[i];
      for (let j = 0; j < playerHand.length; j++) {
        const card = playerHand[j];
        if (card.rank === "A" && card.suit === "♠") {
          return i; // Return the index of the player's hand
        }
      }
    }
    return -1; // Return -1 if the Ace of Spades is not found
  }



  const getRandomUserId = () => {
    dispatch({
      type: types.SET_RANDOM_USER_ID,
      payload: Math.floor(Math.random() * 1000000000)
    })
  }

  function getRoomDataFromName(room_id) {
    const q = query(collection(db, "rooms"), where("room_name", "==", room_id));
    return getDocs(q).then((querySnapshot) => {
      console.log(querySnapshot);
      if (!querySnapshot.empty) {
        var jsonData = querySnapshot.docs.map(doc => doc.data());
        jsonData[0].id = querySnapshot.docs[0].id;
        return jsonData[0];
      }
    });
  }

  function checkPassword(room_name, room_password) {
    const q = query(collection(db, "rooms"), where("room_name", "==", room_name));
    return getDocs(q).then((querySnapshot) => {
      console.log(querySnapshot);
      if (!querySnapshot.empty) {
        var jsonData = querySnapshot.docs.map(doc => doc.data());
        if (jsonData[0].room_password === room_password) {
          return true;
        } else {
          return false;
        }
      }
    });
  }

  function addUserToTheRoom(room, current_user, playing) {
    const roomRef = doc(db, "rooms", room.id);
    if (playing) {
      return updateDoc(roomRef, {
        users: [...room.users, current_user]
      })
    } else {
      return updateDoc(roomRef, {
        watching_users: [...room.watching_users, current_user]
      })
    }
  }

  function changeRoomOnDocChange(room_id) {
    onSnapshot(doc(db, "rooms", room_id), (doc) => {
      console.log(doc.data());
      var data = doc.data();
      data.id = doc.id;
      dispatch({
        type: types.SET_INITIAL_DATA_REDUCER,
        payload: data
      });
    });

  }


  const setPersistentState = (state) => {
    dispatch({ type: types.SET_LOADING, payload: true });
    dispatch({
      type: types.SET_PERS_DATA,
      payload: state
    });
    dispatch({ type: types.SET_LOADING, payload: false });
  };





  return (
    <UserContext.Provider
      value={{
        userState,
        createRoom,
        startGame,
        playCard
      }}
    >
      {" "}
      {children}{" "}
    </UserContext.Provider>
  );
};