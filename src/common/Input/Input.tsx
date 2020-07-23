import React, {useState} from "react";
import classes from "./Input.module.scss";
import {KeyboardEvent} from "react";

type PropsType = {
    onChange: (text: string) => void
    disabled?: boolean
    value: string
    addData?: () => void
    error?: boolean
    placeHolder?: string
}

export function Input(props: PropsType) {

    const onPressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            props.addData && props.addData()
        }
    }

    const inputErrorStyle = props.error ? `${classes.input__elem} ${classes.error}` : classes.input__elem

    return (
        <>
            <div className={classes.input}>
                <input type="text"
                       placeholder={props.placeHolder}
                       className={inputErrorStyle}
                       onChange={e => props.onChange(e.currentTarget.value)}
                       onKeyPress={onPressEnter}
                       value={props.value}
                       disabled={props.disabled}/>
                {/*<div className={props.error ? classes.input__error : ""}>{props.error}</div>*/}
            </div>
        </>
    )
}
