export const initialState = {
    signedIn: false,
    userProfile: null,
    showSignIn: false,
    showSignUp: false,
    signedInUser: null,
    isOpen: true,
    hasProfile: true,
};

export const appReducer = (state, action) => {
    switch (action.type) {
        case 'SET_SIGNEDIN_USER':
            return { ...state, signedInUser: action.payload, signedIn: true };
        case 'SET_USER_PROFILE':
            return { ...state, userProfile: action.payload };
        case 'REMOVE_TOKEN':
            localStorage.removeItem("token");
            return { ...state, signedIn: false, user: null, signedInUser: null };
        case 'TOGGLE_SIGNED_IN':
            return { ...state, signedIn: action.payload };
        case 'SET_AUTHENTICATED':
            return { ...state, signedIn: true, user: action.payload.user, token: action.payload.token, initialized: true };
        case 'SET_UNAUTHENTICATED':
            if (localStorage.getItem("token")) {
                localStorage.removeItem("token");
            }
            return { ...state, signedIn: false, user: null, signedInUser: null, initialized: false };
        case 'TOGGLE_CHAT_VIEW':
            return { ...state, isOpen: !state.isOpen };
        default:
            return state;
    }
}

