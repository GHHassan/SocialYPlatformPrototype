import React, { createContext, useReducer, useContext } from 'react';
import { postReducer, postInitialState } from './PostReducer';

const PostStateContext = createContext();

export const PostStateProvide = ({ children }) => {
    const [state, dispatch] = useReducer(postReducer, postInitialState);
    return (
        <PostStateContext.Provider value={{ state, dispatch }}>
            {children}
        </PostStateContext.Provider>
    );
}

export const usePostState = () => useContext(PostStateContext);