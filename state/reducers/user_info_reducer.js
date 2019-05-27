const initialState = {
  uid: null,
  userData: null,
  frequentLocations: [],
  mostProductiveDays: {},
  leastProductiveDays: {},
  mostProductiveLocations: [],
};

const UserInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'setUserID':
      return { ...state, uid: action.value };

    case 'setUserData':
      return { ...state, userData: action.value };

    case 'setFrequentLocations':
      return { ...state, frequentLocations: action.value };

    case 'setMostProductiveDays':
      return { ...state, mostProductiveDays: action.value };

    case 'setLeastProductiveDays':
      return { ...state, leastProductiveDays: action.value };

    case 'setMostProductiveLocations':
      return { ...state, mostProductiveLocations: action.value };

    default:
      return state;
  }
};

export default UserInfoReducer;
