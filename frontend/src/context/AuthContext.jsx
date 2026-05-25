//step 1 create thw conext object

import { createContext, useContext ,useState} from "react";


const AuthContext=createContext();



//Step 2 The Provider -wraps the entire ap

export function AuthProvider({children})
{

    //initialize user from local storage (so login survuves page refresh)
    const [user,setUser]=useState(()=>{
        const saved =localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
     
    });



    // login() - called after successful login/register
    // Saves token + user to BOTH localStorage AND state
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);   // This triggers React to re-render ALL children
    };




    const logout=()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);

    }


    return (
        <AuthContext.Provider value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth()
{
    return useContext(AuthContext);
}