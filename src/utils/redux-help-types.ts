import {FieldErrorType} from "../api/todolists-a-p-i";
import {store} from "../app/store";

export type AppDispatchType = typeof store.dispatch

export type ThunkErrorType = { rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] } }
