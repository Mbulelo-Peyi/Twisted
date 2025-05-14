import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';


const baseURL = "http://192.168.219.1:8000";

const useAxios = () =>{
    let {user, setUser, authTokens, setAuthTokens} = useContext(AuthContext);
    const axiosInstance = axios.create({
        baseURL,
        headers:{Authorization: `Bearer ${authTokens?.access}`}
    });

    axiosInstance.interceptors.request.use(async req => {
        const config = {
            headers: {
                "Content-Type":"application/json",
            }
        };
        setUser(jwtDecode(authTokens?.access))
        // let isExpired = dayjs.unix(user?.exp).diff(dayjs()) < 1;
        // if(!isExpired) return req
        // const decoded = jwtDecode(tokens.access);
        let isExpired = dayjs().isAfter(dayjs.unix(user?.exp));
        if(!isExpired) return req;
    
        if(isExpired){
            const response = await axios.post(
                `${baseURL}/api/token/refresh/`,
                {
                    refresh: authTokens?.refresh
                },
                config
            )
            if (response.status === 200){
                setAuthTokens(response.data)
                setUser(jwtDecode(response.data?.access))
                await SecureStore.setItemAsync('authTokens', JSON.stringify(response.data));
                req.headers.Authorization=`Bearer ${response.data?.access}`;
                return req
            } else if (response.status === 401){
                return req
            }
        }
    })

    return axiosInstance;
};

export default useAxios;