import React from 'react';
import App from "./App";
import {ReduxStoreProviderDecorator} from "./stories/ReduxStoreProviderDecorator";

export default {
    title: 'AppWithRedux',
    component: App,
    decorators: [ReduxStoreProviderDecorator]
};


export const EditableSpanBaseExapmle = (props: any) => {
    return (
        <App/>
    )
}
