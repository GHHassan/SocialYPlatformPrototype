/**
 * @fileoverview Home Reducer
 * Reducer for the home page
 * This reducer is used to manage the state of the home page 
 * and its children components.
 * 
 * @author Ghulam Hassan Hassani <w20017074>
 */

export const homeInitialState = {
    reloadPosts: true,
    posts: [],
    showEditPost: false,
    showActions: false,
    postToBeEdited: null,
    allComments: [],
};

export const homeReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_SHOW_EDIT_POST':
            return { ...state, showEditPost: action.payload };
        case 'SET_POSTS':
            return { 
                ...state, 
                posts: action.payload,
                reloadPosts: false,
            };
        case 'RELOAD_POSTS':
            return { ...state, reloadPosts: action.payload };
        case 'SET_COMMENTS':
            return { ...state, allComments: action.payload };
        case 'SET_EDITING_POST':
            return { ...state, postToBeEdited: action.payload };
        case 'TOGGLE_ACTIONS':
            return { ...state, showActions: action.payload };
        default:
            return state;
    }
}