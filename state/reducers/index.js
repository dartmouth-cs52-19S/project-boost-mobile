import { combineReducers } from 'redux';

import UserInfoReducer from './user_info_reducer';
import APIErrorReducer from './api_error_reducer';

const rootReducer = combineReducers({
  user: UserInfoReducer,
  api_error: APIErrorReducer,
});

export default rootReducer;
