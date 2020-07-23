import React from "react";
import classes from "./Button.module.scss";

type PropsType = {
    onClick: () => void
    btnName: string
    disabled: boolean
    btnType?: "green" | "red"
    btnActive?: boolean
}

export function Button(props: PropsType) {

    let buttonClasses = classes.button
    if (props.btnActive) {
        buttonClasses = `${buttonClasses} ${classes.active}`;
    }

    switch (props.btnType) {
        case "red":
            buttonClasses = `${buttonClasses} ${classes.red}`;
            break;
        case "green":
            buttonClasses = `${buttonClasses} ${classes.green}`;
            break;
    }



    return (
        <>
            <button className={buttonClasses}
                    disabled={props.disabled}
                    onClick={props.onClick}>
                {props.btnName}
            </button>
        </>
    )
}
