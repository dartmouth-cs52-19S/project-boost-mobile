import { combineReducers } from 'redux';

import UserInfoReducer from './user_info_reducer';
import LocationReducer from './location_reducer';

const rootReducer = combineReducers({
  user: UserInfoReducer,
  locations: LocationReducer,
});

export default rootReducer;
