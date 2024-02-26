import {applyMiddleware, createStore} from "redux";
import reducers from "./reducers";
import {thunk} from "redux-thunk";
import {ActionType} from "./action-types";

export const store = createStore(reducers, {}, applyMiddleware(thunk));
