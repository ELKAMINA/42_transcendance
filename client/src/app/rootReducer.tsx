import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import authReducer from '../redux-features/auth/authSlice';
import friendshipReducer from '../redux-features/friendship/friendshipSlice';
import channelsReducer from '../features/chat/channelsSlice'
import channelUserReducer from '../features/chat/channelUserSlice'
import channelTypeReducer from '../features/chat/channelTypeSlice'
import channelNameReducer from '../features/chat/channelNameSlice'

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
	channels: channelsReducer,
	channelName: channelNameReducer,
	channelUser: channelUserReducer,
	channelType: channelTypeReducer,
});


export { rootPersistConfig, rootReducer };
