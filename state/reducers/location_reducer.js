const initialState = [];

const LocationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'setLocationStars':
      // return state.filter((item, index) => index !== action.value.index);
      return state.map((location, index) => {
        if (index === action.value.index) {
          return {
            ...location,
            timesObserved: action.value.timesObserved,
          };
        } else {
          return location;
        }
      });
    case 'setFrequentLocations':
      return [...action.value.output];
    default:
      return state;
  }
};

export default LocationReducer;
