import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ email: '', phone: '' });

  const storeUser = (email, phone) => {
    setUser({ email, phone });
    console.log("in uer contet,uer=",user)
  };
  const clearUser = () => {
    setUser({ email: '', phone: '' }); 
    
  };
  return (
    <UserContext.Provider value={{ user, storeUser }}>
      {children}
    </UserContext.Provider>
  );
};
