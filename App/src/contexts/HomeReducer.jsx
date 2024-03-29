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
        case 'TOGGLE_EDIT_POST':
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