import { ActionTypes } from '../actions/index';

const initialState = {};

const APIErrorReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.API_ERROR:
      return action.payload;

    default:
      return state;
  }
};

export default APIErrorReducer;
