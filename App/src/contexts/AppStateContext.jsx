import React, { createContext, useReducer, useContext } from 'react';
import { appReducer, initialState } from './AppReducer';

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
            {children}
        </AppStateContext.Provider>
    );
}

export const useAppState = () => useContext(AppStateContext);