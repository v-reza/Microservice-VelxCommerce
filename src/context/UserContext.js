import { createContext, useEffect, useReducer } from "react";
import { axiosGet } from "../helper/axiosHelper";
import AuthReducer from "./UserReducer";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
  token: JSON.parse(localStorage.getItem("access-token")) || null
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)
    
    useEffect(() => {
        const saveStorage = async () => {
            // const {token, ...other} = state.user || {}
            localStorage.setItem("user", JSON.stringify(state.user))
            localStorage.setItem("access-token", JSON.stringify(state.token))
            if (state.user && state.token) {
                await axiosGet("/storeToken", {
                    headers:{
                        Authorization: `Bearer ${state.token}`
                    }
                }).then((res) => {
                    return;
                }).catch((err) => {
                    localStorage.removeItem("user")
                    localStorage.removeItem("access-token")
                    window.location.reload()
                })
            }
        }
        saveStorage()    
    }, [state.token, state.user])

    return (
        <AuthContext.Provider
            value={{ 
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                token: state.token,
                dispatch
             }}
        >
            {children}
        </AuthContext.Provider>
    )
};
