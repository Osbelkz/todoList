import React, {ChangeEvent, useState} from "react";
import { TextField } from "@material-ui/core";

type EditableSpanPropsType = {
    title: string
    changeTitle: (newTitle: string) => void
}

export const EditableSpan = React.memo(function (props: EditableSpanPropsType) {
    console.log("editable span")
    let [editMode, setEditMode] = useState<boolean>(false)
    let [title, setTitle] = useState<string>('')


    function activateEditMode() {
        setEditMode(true)
        setTitle(props.title)
    }

    function deactivateEditMode() {
        setEditMode(false)
        props.changeTitle(title)
    }

    function changeTitleHandler(e: ChangeEvent<HTMLInputElement>) {
        setTitle(e.target.value)
    }


    return editMode
        ? <TextField value={title} variant={"outlined"} size={"small"} onChange={changeTitleHandler} onBlur={deactivateEditMode} autoFocus/>
        : <span onDoubleClick={activateEditMode}>{props.title}</span>
})
