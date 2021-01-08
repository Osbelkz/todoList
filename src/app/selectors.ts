import {AppRootStateType} from "./store";

export const selectStatus = (state: AppRootStateType) => state.app.status
export const selectInitApp = (state: AppRootStateType) => state.app.init
