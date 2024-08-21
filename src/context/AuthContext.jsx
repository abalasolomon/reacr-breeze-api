import { useState, createContext, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [errors, setErrors] = useState("");
    const navigate = useNavigate();
    const csrf = () => axios.get('/sanctum/csrf-cookie');
    const getUser = async () => {
        const { data } = await axios.get();
        setUser(data);
    }
    const login = async ({ ...data }) => {
        await csrf();
        try {
          const csrfToken = await csrf();
          const headers = {
            'X-CSRF-TOKEN': csrfToken.data,
          };
          await axios.post('/login', data, { headers });
          await getUser();
          navigate('/');
        } catch (error) {
          if (error.response && error.response.status === 422) {
            setErrors(error.response.data.errors);
          }
        }
      };

    const register = async ({...data}) => {
        await csrf();
        try {
             await axios.post('/register', data);
             console.log('right before registering',data)
             await getUser();
         //   navigate('/');
        } catch (error) { 
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors); // Corrected from setError to setErrors
            }
        }
    }
     
    const logout = async () => {
        await csrf();
        axios.post("/logout").then (() => {
            setUser(null);
        });
    };

    return <AuthContext.Provider value={{user,errors, getUser,login,register,logout}}>
        {children}
    </AuthContext.Provider>
}

export default function useAuthContext(){
    return useContext(AuthContext);
}