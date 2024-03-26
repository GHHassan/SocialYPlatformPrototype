export const postInitialState = {
    reloadPosts: true,
    posts: [],
    showEditPost: false,
    showActions: false,
    postToBeEdited: null,
    allComments: [],
};

export const postReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_EDIT_POST':
            return { ...state, showEditPost: action.payload };
        case 'SET_POSTS':
            console.log('setting posts', action.payload);
            return { 
                ...state, 
                posts: action.payload,
                reloadPosts: false,
            };
        case 'RELOAD_POSTS':
            return { ...state, reloadPosts: action.payload };
        case 'SET_COMMENTS':
            return { ...state, allComments: action.payload };
        default:
            return state;
    }
}