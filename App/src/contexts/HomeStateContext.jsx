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