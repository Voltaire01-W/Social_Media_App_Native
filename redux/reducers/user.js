import { USER_STATE_CHANGE, SET_UNAUTHENTICATED, SET_AUTHENTICATED, SET_USER, LOADING_USER, LOADING_UI, CLEAR_ERRORS, SET_ERRORS, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, CLEAR_DATA } from "../constants"

const initialState = {
    currentUser: null,
    posts: [],
    following: [],
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: [],
    errors: null
}

export const user = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true
            };
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
            return {
                authenticated: true,
                loading: false,
                ...action.payload
            };
        case LOADING_USER: 
            return {
                ...state,
                loading: true
            };
        case SET_ERRORS:
            return {
                ...state,
                loading: false,
                errors: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                loading: false,
                errors: null
            };
        case LOADING_UI:
            return {
                ...state,
                loading: true
            };
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_POSTS_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }

        case USER_FOLLOWING_STATE_CHANGE:
            return {
                ...state,
                following: action.following
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}