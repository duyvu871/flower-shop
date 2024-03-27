export const ADD_ITEM = 'ADD_ITEM';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const SET_CURRENT_TABLE = 'SET_CURRENT_TABLE';

export type Item = any & {_id: string}

export const addItem = (item: Item) => ({
    type: ADD_ITEM as typeof ADD_ITEM,
    payload: item,
});

export const updateItem = (updatedItem: Item) => ({
    type: UPDATE_ITEM as typeof UPDATE_ITEM,
    payload: updatedItem,
});

export const deleteItem = (itemId: string) => ({
    type: DELETE_ITEM as typeof DELETE_ITEM,
    payload: itemId,
});

export const setCurrentTable = (table: Item[]) => ({
    type: SET_CURRENT_TABLE as typeof SET_CURRENT_TABLE,
    payload: table,
});