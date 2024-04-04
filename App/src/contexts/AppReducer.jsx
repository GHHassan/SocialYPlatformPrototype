/**
 * @file AppReducer.jsx
 * 
 * @description This file contains the reducer function for the AppContext.
 * It contains the initial state and the reducer function that updates the state
 * based on the action type.
 * 
 * @version 1.0
 * @date 04/18/2021
 * @author: Hassan
 */

export const initialState = {
    signedIn: false,
    userProfile: null,
    showSignIn: false,
    showSignUp: false,
    signedInUser: null,
    isChatOpen: true,
    hasProfile: true,
    reloadProfile: false,
};

export const appReducer = (state, action) => {
    switch (action.type) {
        case 'SET_SIGNEDIN_USER':
            return { ...state, signedInUser: action.payload, signedIn: true };
        case 'SET_USER_PROFILE':
            state.reloadProfile = false;
            return { ...state, userProfile: action.payload };
        case 'REMOVE_TOKEN':
            localStorage.removeItem("token");
            return { ...state, signedIn: false, userProfile: null, signedInUser: null };
        case 'TOGGLE_SIGNED_IN':
            return { ...state, signedIn: action.payload };
        case 'TOGGLE_CHAT_VIEW':
            return { ...state, isChatOpen: !state.isChatOpen };
        case 'RELOAD_PROFILE':
            return { ...state, reloadProfile: true };
        default:
            return state;
    }
}

