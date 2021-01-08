import React, {ChangeEvent, useState} from "react";
import { TextField } from "@material-ui/core";
import {RequestStatusType} from "../../app/app-reducer";

type EditableSpanPropsType = {
    value: string
    onChange: (newTitle: string) => void
    entityStatus: RequestStatusType
}

export const EditableSpan = React.memo(function (props: EditableSpanPropsType) {
    console.log("editable span")
    let [editMode, setEditMode] = useState<boolean>(false)
    let [title, setTitle] = useState<string>('')


    function activateEditMode() {
        if (!(props.entityStatus==="loading")) {
            setEditMode(true)
            setTitle(props.value)
        }
    }

    function deactivateEditMode() {
        setEditMode(false)
        props.onChange(title)
    }

    function changeTitleHandler(e: ChangeEvent<HTMLInputElement>) {
        setTitle(e.target.value)
    }


    return editMode
        ? <TextField value={title} variant={"outlined"} size={"small"} onChange={changeTitleHandler} onBlur={deactivateEditMode} autoFocus/>
        : <span onDoubleClick={activateEditMode}>{props.value}</span>
})
