import React, {useState, ChangeEvent} from "react";
import {Button, Input, TextField, IconButton} from "@material-ui/core";
import {AddCircle} from "@material-ui/icons";


type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export function AddItemForm(props: AddItemFormPropsType) {

    let [newTaskText, setTaskText] = useState('');
    let [error, setError] = useState<string | null>(null);

    function onTaskNameChanged(e: ChangeEvent<HTMLInputElement>): void {
        setTaskText(e.target.value);
        setError(null);
    }

    function addItem(): void {
        if (newTaskText.trim()) {
            props.addItem(newTaskText.trim());
            setTaskText('');
        }
        setError('Title is required!');
    }

    return (
        <div>
            <TextField onChange={onTaskNameChanged}
                       value={newTaskText}
                       onKeyPress={(e) => {if (e.key === "Enter") addItem()}}
                       variant={"outlined"}
                       size={"small"}
                       error={!!error}
                       helperText={error}
                       label={"Title"}
            />
            <IconButton color={"primary"} onClick={addItem} disabled={!newTaskText}>
                <AddCircle/>
            </IconButton>
        </div>
    )
}
