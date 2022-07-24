import axios from "axios";
const api = "http://localhost:3300/api"

export async function axiosGet(url, config = null) {
    return await axios.get(api+url, config)
}
export async function axiosPost(url, config = null) {
    return await axios.post(api+url, config)
}
export async function axiosPut(url, config = null) {
    return await axios.put(api+url, config)
}
export async function axiosDelete(url, config = null) {
    return await axios.delete(api+url, config)
}