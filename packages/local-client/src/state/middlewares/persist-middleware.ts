import {Dispatch} from "redux";
import {Action} from "../actions";
import {ActionType} from "../action-types";
import {saveCells} from "../action-creators";
import {RootState} from "../reducers";

export const persistMiddleware = ({dispatch, getState}: {
  dispatch: Dispatch<Action>,
  getState: () => RootState,
}) => {
  let timer: any;

  return (next: (action: Action) => void) => {
    return (action: any) => {
      next(action);

      if (
         [
           ActionType.UPDATE_CELL,
           ActionType.MOVE_CELL,
           ActionType.DELETE_CELL,
           ActionType.INSERT_CELL_AFTER,
         ].includes(action.type)
      ) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          saveCells()(dispatch, getState);
        }, 1000)
      }
    };
  };
};
