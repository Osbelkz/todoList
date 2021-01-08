import React, {useState, ChangeEvent, KeyboardEvent} from "react";
import {TextField, IconButton} from "@material-ui/core";
import {AddCircle} from "@material-ui/icons";
import {RequestStatusType} from "../../app/app-reducer";


export type AddItemFormSubmitHelperType = {
    setError: (error: string) => void,
    setTaskText: (title: string) => void
}

type AddItemFormPropsType = {
    addItem: (params: { title: string }, helper: AddItemFormSubmitHelperType) => void
    entityStatus: RequestStatusType
}

export const AddItemForm = React.memo(function (props: AddItemFormPropsType) {
    let [newTaskText, setTaskText] = useState('');
    let [error, setError] = useState<string | null>(null);

    function onTaskNameChanged(e: ChangeEvent<HTMLInputElement>): void {
        setTaskText(e.target.value);
        setError(null);
    }

    const addItem = async () => {
        if (newTaskText.trim()) {
            props.addItem({title: newTaskText.trim()}, {setError, setTaskText});
        } else {
            setError('Title is required!');
        }
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLDivElement>) => {
        if (error !== null) setError(null)
        if (e.key === "Enter") addItem()
    }

    return (
        <div>
            <TextField onChange={onTaskNameChanged}
                       value={newTaskText}
                       onKeyPress={onKeyPressHandler}
                       variant={"outlined"}
                       size={"small"}
                       error={!!error}
                       helperText={error}
                       label={"Title"}
                       disabled={props.entityStatus === "loading"}
            />
            <IconButton color={"primary"}
                        onClick={addItem}
                        disabled={!newTaskText && props.entityStatus === "loading"}
                        style={{marginLeft: "5px"}}
            >
                <AddCircle/>
            </IconButton>
        </div>
    )
})
