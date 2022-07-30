const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
        token: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
        token: action.payload.token,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: true,
        token: null,
      };
    case "LOGOUT":
      return {
        user: null,
        isFetching: false,
        error: false,
        token: null,
      };
    case "ADD_CART":
      return {
        ...state,
        user: {
          ...state.user,
          cart: [...state.user.cart, action.payload],
        },
      };
    case "DELETE_CART":
      return {
        ...state,
        user: {
          ...state.user,
          cart: state.user.cart.filter((cart) => cart !== action.payload),
        },
      };
    case "UPDATE_PROFILE_INFORMATION":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    default:
  }
};

export default AuthReducer;
