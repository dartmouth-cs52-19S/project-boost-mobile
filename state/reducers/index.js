import { combineReducers } from 'redux';

import UserInfoReducer from './user_info_reducer';

const rootReducer = combineReducers({
  user: UserInfoReducer,
});

export default rootReducer;
