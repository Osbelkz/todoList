import {appReducer, AppStateType, setAppErrorAC, setAppStatusAC} from "./app-reducer";


let startState: AppStateType;

describe("app reducer tests", () => {
    beforeEach(()=> {
        startState  = {
            status: "idle",
            error: null,
            init: false
        }
    })
    test("correct error message should be set", ()=> {
        const endState = appReducer(startState, setAppErrorAC({error:"some error"}))

        expect(endState.error).toBe("some error")
    })
    test("correct status should be set", ()=> {
        const endState = appReducer(startState, setAppStatusAC({status: "loading"}))

        expect(endState.status).toBe("loading")
    })
})
