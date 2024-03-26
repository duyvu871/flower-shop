import {ADD_USER, UPDATE_USERS, DELETE_USER, deleteUser, updateUsers, addUser} from '@/adminRedux/action/userData';
import {UserInterface} from "types/userInterface";

export interface UserState {
    users: UserInterface[];
}

const initialState: UserState = {
    users: [],
};

type UserAction =
    | ReturnType<typeof addUser>
    | ReturnType<typeof updateUsers>
    | ReturnType<typeof deleteUser>;

const userReducer = (state: UserState = initialState, action: UserAction): UserState => {
    switch (action.type) {
        case ADD_USER:
            return {
                ...state,
                users: [...state.users, action.payload],
            };
        case UPDATE_USERS:
            return {
                ...state,
                users: action.payload,
            };
        case DELETE_USER:
            return {
                ...state,
                users: state.users.filter(user => user._id as unknown as string !== action.payload),
            };
        default:
            return state;
    }
};

export default userReducer;