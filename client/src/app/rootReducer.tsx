import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import authReducer from '../redux-features/auth/authSlice';
import friendshipReducer from '../redux-features/friendship/friendshipSlice';
import gameReducer from '../redux-features/game/gameSlice';
import channelsReducer from '../redux-features/chat/channelsSlice'
import channelUserReducer from '../redux-features/chat/createChannel/channelUserSlice'
import channelTypeReducer from '../redux-features/chat/createChannel/channelTypeSlice'
import channelNameReducer from '../redux-features/chat/createChannel/channelNameSlice'
// HANDLE ERROR ON WHOLE createChannel COMPONENT
import createChannelErrorReducer from '../redux-features/chat/createChannel/createChannelErrorSlice';

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
	game: gameReducer,
	channels: channelsReducer,
	channelName: channelNameReducer,
	channelUser: channelUserReducer,
	channelType: channelTypeReducer,
	createChannelError: createChannelErrorReducer,
});


export { rootPersistConfig, rootReducer };
