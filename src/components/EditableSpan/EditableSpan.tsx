import React, {ChangeEvent, useState} from "react";

type EditableSpanPropsType = {
    title: string
    changeTitle: (newTitle: string) => void
}

export function EditableSpan(props: EditableSpanPropsType) {

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
        ? <input value={title} onChange={changeTitleHandler} onBlur={deactivateEditMode} autoFocus/>
        : <span onDoubleClick={activateEditMode}>{props.title}</span>
}
