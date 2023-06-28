export const SET_INITIAL_DATA_REDUCER = 'SET_INITIAL_DATA_REDUCER';
export const SET_PERS_DATA = 'SET_PERS_DATA';
export const SET_USER_DATA = 'SET_USER_DATA';
export const SET_RANDOM_USER_ID = 'SET_RANDOM_USER_ID';
export const SET_LOADING = 'SET_LOADING';


// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {




      
    case SET_INITIAL_DATA_REDUCER:
      return {
        ...state,
        room: action.payload,
      };

    case SET_PERS_DATA:
      return {
        ...state,
        current_user: action.payload.current_user,
        room: action.payload.room,
        tempUserId: action.payload.tempUserId,
      }

    

    case SET_USER_DATA:
      return {
        ...state,
        current_user: action.payload
      };

    case SET_RANDOM_USER_ID:
      return {
        ...state,
        tempUserId: action.payload
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };





    default:
  }
};
