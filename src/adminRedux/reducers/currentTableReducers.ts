import {
    ADD_ITEM,
    UPDATE_ITEM,
    DELETE_ITEM,
    SET_CURRENT_TABLE,
    Item,
    addItem,
    updateItem, deleteItem, setCurrentTable
} from '@/adminRedux/action/currentTable';

export interface CurrentTableState<T> {
    currentTable: T[];
}

const initialState: CurrentTableState<Item> = {
    currentTable: [],
};

type CurrentTableAction =
    | ReturnType<typeof addItem>
    | ReturnType<typeof updateItem>
    | ReturnType<typeof deleteItem>
    | ReturnType<typeof setCurrentTable>;

export default function currentTableReducer(
    state = initialState,
    action: CurrentTableAction
): CurrentTableState<Item> {
    switch (action.type) {
        case ADD_ITEM:
            return {
                ...state,
                currentTable: [action.payload, ...state.currentTable],
            };
        case UPDATE_ITEM:
            return {
                ...state,
                currentTable: state.currentTable.map((item) =>
                    item._id === action.payload._id ? {...item, ...action.payload} : item
                ),
            };
        case DELETE_ITEM:
            return {
                ...state,
                currentTable: state.currentTable.filter(
                    (item) => item._id !== action.payload
                ),
            };
        case SET_CURRENT_TABLE:
            return {
                ...state,
                currentTable: action.payload,
            };
        default:
            return state;
    }
}
