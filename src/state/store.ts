import {applyMiddleware, createStore} from "redux";
import reducers from "./reducers";
import {thunk} from "redux-thunk";
import {ActionType} from "./action-types";

export const store = createStore(reducers, {}, applyMiddleware(thunk));

for (let i = 0; i < 10; i++) {

  store.dispatch({
    type: ActionType.INSERT_CELL_BEFORE,
    payload: {
      id: null,
      type: Math.random() > 0.5 ? 'text' : 'code',
    }
  })
}
