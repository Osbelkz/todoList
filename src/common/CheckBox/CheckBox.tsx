import React from "react";
import classes from "./CheckBox.module.scss";

type PropsType = {
    onClick: (value: boolean) => void
    disabled?: boolean
    checked: boolean
    label: string
}

export function CheckBox(props: PropsType) {
    return (
        <label className={classes.wrapper}>
            <input type='checkbox'
                   className={classes.checkbox}
                   checked={props.checked}
                   onChange={e => props.onClick(e.currentTarget.checked)}
                   disabled={props.disabled}/>
                   <span className={classes.checkbox__label}>{props.label}</span>
        </label>
    )
}

