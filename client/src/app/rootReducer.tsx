import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import authReducer from '../redux-features/auth/authSlice';
import friendshipReducer from '../redux-features/friendship/friendshipSlice';
import channelsReducer from '../redux-features/chat/channelsSlice'
import channelUserReducer from '../redux-features/chat/createChannel/channelUserSlice'
import channelTypeReducer from '../redux-features/chat/createChannel/channelTypeSlice'
import channelNameReducer from '../redux-features/chat/createChannel/channelNameSlice'

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
