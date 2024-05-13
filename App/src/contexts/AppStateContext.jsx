/**
 * @fileoverview App State Context
 * Context for the app state and dispatch
 * This context is used to manage the application's
 * global state.
 * 
 * @author Ghulam Hassan Hassani <w20017074>
 */

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