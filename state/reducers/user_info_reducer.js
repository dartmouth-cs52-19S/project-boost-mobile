const initialState = {
  uid: null,
  userData: null,
  frequentLocations: [],
  newLocations: [],
};

const UserInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'setUserID':
      return { ...state, uid: action.value };

    case 'setUserData':
      return { ...state, userData: action.value };

    case 'setFrequentLocations':
      return { ...state, frequentLocations: action.value };

    case 'setNewLocations':
      return { ...state, newLocations: action.value };

    default:
      return state;
  }
};

export default UserInfoReducer;
