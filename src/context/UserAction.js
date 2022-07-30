export const LoginStart = (userCredentials) => ({
  type: "LOGIN_START",
});

export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const LoginFailure = () => ({
  type: "LOGIN_FAILURE",
});

export const AddCart = (productId) => ({
  type: "ADD_CART",
  payload: productId,
});

export const DeleteCart = (productId) => ({
  type: "DELETE_CART",
  payload: productId,
});

export const UpdateProfileInformation = (user) => ({
  type: "UPDATE_PROFILE_INFORMATION",
  payload: user,
});
