import {UserInterface} from "types/userInterface";

export const ADD_USER = 'ADD_USER';
export const UPDATE_USERS = 'UPDATE_USERS';
export const DELETE_USER = 'DELETE_USER';

export const addUser = (user: UserInterface) => ({
    type: ADD_USER as typeof ADD_USER,
    payload: user,
});

export const updateUsers = (users: UserInterface[]) => ({
    type: UPDATE_USERS as typeof UPDATE_USERS,
    payload: users,
});

export const deleteUser = (_id: string) => ({
    type: DELETE_USER as typeof DELETE_USER,
    payload: _id,
});