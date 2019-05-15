const initialState = {
  uid: null,
};

const UserInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'setUserID':
      return { ...state, uid: action.value };

    default:
      return state;
  }
};

export default UserInfoReducer;
