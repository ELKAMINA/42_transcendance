import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import authReducer from '../redux-features/auth/authSlice';
import friendshipReducer from '../redux-features/friendship/friendshipSlice';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  //   whitelist: [],
  //   blacklist: [],
};

const rootReducer = combineReducers({
  auth: authReducer,    
  friendship: friendshipReducer,
});


export { rootPersistConfig, rootReducer };
