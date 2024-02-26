import {ActionType} from "../action-types";
import {CellType} from "../cell";

export type Direction = 'up' | 'down';

export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  payload: {
    id: string;
    content: string;
  };
}

export interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: {
    id: string;
  };
}

export interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: {
    id: string;
    direction: Direction;
  };
}

export interface InsertCellAfterAction {
  type: ActionType.INSERT_CELL_AFTER;
  payload: {
    id: string | null;
    type: CellType;
  };
}


export type Action =
   | UpdateCellAction
   | DeleteCellAction
   | MoveCellAction
   | InsertCellAfterAction
   ;
