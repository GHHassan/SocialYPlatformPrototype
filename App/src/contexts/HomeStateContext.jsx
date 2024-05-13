/**
 * HomeStateContext.jsx
 * 
 * this file is used to create a context for the home state.
 * It uses the useReducer hook to manage the state of the home page
 * and its children components.
 * 
 * @author Ghulam Hassan Hassani <w20017074>
 */
import React, { createContext, useReducer, useContext } from 'react';
import { homeReducer, homeInitialState } from './HomeReducer';

const HomeStateContext = createContext();

export const HomeStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(homeReducer, homeInitialState);
    return (
        <HomeStateContext.Provider value={{ state, dispatch }}>
            {children}
        </HomeStateContext.Provider>
    );
}

export const useHomeState = () => useContext(HomeStateContext);