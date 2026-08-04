import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);


export function AuthProvider({ children }) {


  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });



  const [loading, setLoading] = useState(false);



  const login = ({ user, token }) => {

    setUser(user);
    setToken(token);

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    localStorage.setItem(
      "token",
      token
    );
  };



  const logout = () => {

    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

  };



  const value = useMemo(()=>({

    user,
    token,
    loading,

    isAuthenticated: Boolean(token && user),

    login,
    logout

  }),[user,token,loading]);



  return (

    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>

  );

}



export function useAuth(){

 const context = useContext(AuthContext);


 if(!context){

  throw new Error(
    "useAuth must be used inside AuthProvider"
  );

 }


 return context;

}