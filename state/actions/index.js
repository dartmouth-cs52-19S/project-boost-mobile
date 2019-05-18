const setUserID = uid => {
  return {
    type: 'setUserID',
    value: uid,
  };
};

const setUserData = userData => {
  return {
    type: 'setUserData',
    value: userData,
  };
};

export { setUserID, setUserData };
