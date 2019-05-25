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

const setFrequentLocations = frequentLocations => {
  return {
    type: 'setFrequentLocations',
    value: frequentLocations,
  };
};

const setLocationStars = ({ timesObserved, index }) => {
  return {
    type: 'setLocationStars',
    value: { timesObserved, index },
  };
};

export { setUserID, setUserData, setFrequentLocations, setLocationStars };
