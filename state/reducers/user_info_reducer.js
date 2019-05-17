const initialState = {
  uid: null,
  userData: null,
};

const UserInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'setUserID':
      return { ...state, uid: action.value };

    case 'setUserData':
      return { ...state, userData: action.value };

    default:
      return state;
  }
};

export default UserInfoReducer;
