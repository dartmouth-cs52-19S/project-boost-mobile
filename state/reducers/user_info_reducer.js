import { ActionTypes } from '../actions/index';

const initialState = {
  uid: null,
  userData: null,
  topFive: null,
  avgProductivity: null,
};

const UserInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER_ID:
      return { ...state, uid: action.payload };

    case ActionTypes.FETCH_USER_INFO:
      return { ...state, userData: action.payload };

    case ActionTypes.FETCH_TOP_FIVE:
      return { ...state, topFive: action.payload };

    case ActionTypes.FETCH_FETCH_AVG:
      return { ...state, avgProductivity: action.payload };

    default:
      return state;
  }
};

export default UserInfoReducer;
