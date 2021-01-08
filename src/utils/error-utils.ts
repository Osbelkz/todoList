import {Dispatch} from "redux";
import {setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {CommonResponseType} from "../api/todolists-a-p-i";

export const handleServerAppError = <D>(data: CommonResponseType<D>,
                                        dispatch: Dispatch,
                                        showError = true
) => {

    if (showError) {
        dispatch(setAppErrorAC({
            error: data.messages.length
                ? data.messages[0]
                : 'Some error occurred'
        }))
    }

    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (error: { message: string },
                                         dispatch: Dispatch,
                                         showError = true
) => {
    if (showError) {
        dispatch(setAppErrorAC({
            error: error.message
                ? error.message
                : 'Some error occurred'
        }))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}
