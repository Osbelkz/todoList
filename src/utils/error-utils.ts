import {Dispatch} from "redux";
import { setAppErrorAC, setAppStatusAC } from "../state/app-reducer";
import {CommonResponseType, RequestStatusCodes} from "../api/todolists-a-p-i";

export const handleServerAppError = (data: CommonResponseType, dispatch: any) => {
    if (data.resultCode === RequestStatusCodes.error) {
        if (data.messages.length) {
            dispatch(setAppErrorAC(data.messages[0]))
        } else {
            dispatch(setAppErrorAC('Some error occurred'))
        }
        dispatch(setAppStatusAC('failed'))
    }
}


export const handleServerNetworkError = (err: any, dispatch: Dispatch) => {
    dispatch(setAppErrorAC(err.message))
    dispatch(setAppStatusAC("failed"))
}
