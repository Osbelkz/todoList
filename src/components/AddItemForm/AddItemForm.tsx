import React, {useState} from "react";
import {Input} from "../../common/Input/Input";
import {Button} from "../../common/Button/Button";


type AddItemFormPropsType = {
    addItem: (title: string)=>void
}

export function AddItemForm(props: AddItemFormPropsType) {

    let [inputValue, setInputValue] = useState('');
    let [error, setError] = useState<string | null>(null);

    function onInputValueChangedHandler(value: string): void {
        setInputValue(value);
        setError(null);
    }

    function addItem(): void {
        if (inputValue.trim()) {
            props.addItem(inputValue.trim());
            setInputValue('');
        }
        setError('Title is required!');
    }

    return (
        <div>
            <Input onChange={onInputValueChangedHandler}
                   value={inputValue}
                   addData={addItem}
                   error={error ? true : false}/>
            <Button onClick={addItem}
                    btnName={"+"}
                    btnType={"green"}
                    disabled={!inputValue}/>
            {error && <div className="error-message">{error}</div>}
        </div>
    )
}
