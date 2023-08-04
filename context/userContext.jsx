import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

const UserContextProvider = ({children})=>{
    const [user, setUser]  = useState(null);
    
    useEffect(()=>{
        if(!user){
            axios.get('/profile').then(({data})=>{
                setUser(data);
            })
        }
    },[])
    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export const UserState=()=>{
    return useContext(UserContext);
}

export default UserContextProvider;