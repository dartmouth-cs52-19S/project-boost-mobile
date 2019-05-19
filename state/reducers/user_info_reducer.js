const initialState = {
  uid: null,
  userData: null,
  providedBackgroundLocation: false,
};

const UserInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'setUserID':
      return { ...state, uid: action.value };

    case 'setUserData':
      return { ...state, userData: action.value };

    case 'setProvidedBackgroundLocation':
      return { ...state, providedBackgroundLocation: action.value };

    default:
      return state;
  }
};

export default UserInfoReducer;
