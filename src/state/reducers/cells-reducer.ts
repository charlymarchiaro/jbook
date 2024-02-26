import {produce} from 'immer';
import {Cell} from "../cell";
import {Action} from "../actions";
import {ActionType} from "../action-types";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  }
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce((state: CellsState = initialState, action: Action): CellsState => {
  switch (action.type) {
     //
    case ActionType.UPDATE_CELL: {
      const {id, content} = action.payload;
      state.data[id].content = content;
      return state;
    }

     //
    case ActionType.DELETE_CELL: {
      const {id} = action.payload;
      delete state.data[id];
      state.order = state.order.filter(item => item !== id);
      return state;
    }

     //
    case ActionType.MOVE_CELL: {
      const {id, direction} = action.payload;
      const index = state.order.findIndex(item => item === id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= state.order.length) {
        return state;
      }
      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = id;
      return state;
    }

     //
    case ActionType.INSERT_CELL_BEFORE: {
      const {id, type} = action.payload;
      const cell: Cell = {
        id: randomId(),
        type,
        content: '',
      };
      state.data[cell.id] = cell;
      const foundIndex = state.order.findIndex(item => item === id);
      if (foundIndex < 0) {
        state.order.push(cell.id);
      } else {
        state.order.splice(foundIndex, 0, cell.id);
      }
      return state;
    }

     //
    default:
      return state;
  }
}, initialState);

const randomId = () => {
  return Math.random().toString(36).substring(2, 7);
};

export default reducer;
