import { combineReducers } from 'redux'
import frameReducer from './frameReducer'
import pageReducer from './pageReducer'

const rootReducer = combineReducers({
  frame: frameReducer,
  page: pageReducer
});
export default rootReducer
