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

const setProvidedBackgroundLocation = bool => {
  return {
    type: 'setProvidedBackgroundLocation',
    value: bool,
  };
};

export { setUserID, setUserData, setProvidedBackgroundLocation };
