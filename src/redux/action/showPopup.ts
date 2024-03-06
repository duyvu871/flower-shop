
export enum ModalActionTypes {
    HideModal,
    ShowModal,
    ToggleModal
}

export interface ModalAction {
    type: ModalActionTypes;
    payload?: boolean;
    modal_name?: string;
}

export function showModal(name: string): ModalAction {
    return {
        type: ModalActionTypes.ShowModal,
        payload: true,
        modal_name: name
    }
}

export function hideModal(name: string): ModalAction {
    return {
        type: ModalActionTypes.HideModal,
        payload: false,
        modal_name: name
    }
}

export function toggleModal(name: string): ModalAction {
    return {
        type: ModalActionTypes.ToggleModal,
        modal_name: name
    }
}

export enum ProfileActionType {
    ShowProfile,
    HideProfile
}

export type ProfileAction = {
    type: ProfileActionType;
    payload: boolean;
    modal_name: string;
}

export function showProfileScreen(): ProfileAction {
    return {
        type: ProfileActionType.ShowProfile,
        payload: true,
        modal_name: "profile"
    }
}

export function hideProfileScreen(): ProfileAction {
    return {
        type: ProfileActionType.HideProfile,
        payload: false,
        modal_name: "profile"
    }
}