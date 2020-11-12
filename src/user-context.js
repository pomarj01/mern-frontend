import React, { useState, createContext } from "react";

// This component is a global state using react's new context api
// Can be written as `React.createContext()` if its not imported
// Context wrapper:
export const UserContext = createContext();

// Context wrapper provider (as component):
export const ContextWrapper = (props) => {
  const defaultValueHandler = () => {
    const user = localStorage.getItem("user");
    if (user) return true;
    return false;
  };

  // defining what context we want to have
  const [isLoggedIn, setIsloggedIn] = useState(defaultValueHandler);
  // passing these context to user
  const user = {
    isLoggedIn,
    setIsloggedIn,
  };

  // Now we nned to define user context we just defined above with a provider
  // and passing value with user
  return (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  );
}


// NOTE: 
// export const == is a variable
// export function == is a function

// NOTE: only use global states when needed as this slows down app's performance
// Such as login/logout, sessions, etc.