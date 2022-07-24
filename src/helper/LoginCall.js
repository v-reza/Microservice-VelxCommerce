import { axiosPost } from "./axiosHelper";

const loginCall = async(userCredentials, dispatch) => {
    dispatch({type: "LOGIN_START"})
    try {
        const res = await axiosPost("/auth/login", userCredentials)
        dispatch({type: "LOGIN_SUCCESS", payload: res.data})
    } catch (error) {
        dispatch({type: "LOGIN_FAILURE", payload: error})
    }
}

export default loginCall