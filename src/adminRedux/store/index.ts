import { createStore } from 'redux';
import rootReducer from '@/adminRedux/reducers';

const store = createStore(rootReducer);
export default store;