import monstera from '../assets/profile_pictures/monstera.jpg'
import lyrata from '../assets/profile_pictures/lyrata.jpg'
import pothos from '../assets/profile_pictures/pothos.jpg'
import succulent from '../assets/profile_pictures/succulent.jpg'
import olivier from '../assets/profile_pictures/olivier.jpg'
import basil from '../assets/profile_pictures/basil.jpg'
import mint from '../assets/profile_pictures/mint.jpg'
import calathea from '../assets/profile_pictures/calathea.jpg'
import cactus from '../assets/profile_pictures/cactus.jpg'
import rick_sanchez from "../assets/profile_pictures/rick_sanchez.jpg"


export type User = {
	name: string;
	roles: string[];
	id: string;
	profile_picture: string;
	friend: boolean;
  }

  export interface UserPrisma  {
	createdAt:       		Date
	updatedAt:        	 Date           
	user_id:               string          
	login:                 string          
	email:                 string         
	hash:                  string
	rtHash:                string
	fA:                    string
	faEnabled:             boolean
	avatar:              	string
	status:                string
	friends:               UserPrisma[]          
	friendOf:              UserPrisma[]          
	totalFriends:          number           
	FriendRequestSent:     [{}] 
	FriendRequestReceived: [{}] 
	blocked:              User[]          
	blockedBy:             User[]          
	totalBlockedFriends:   number
	totalMatches:          number
	totalWins:             number
	totalloss:             number
	level:                 number
	rank:                  number
	p1:                    [{}]         
	p2:                    [{}]         
	// // Channel Management
	// //*** Where the user is member ***//
	channels:              [{}]       
	// //*** If the user is creator ***//
	createdChannels:       [{}]      
	messagesSent:          [{}]     
  }

export const userList:User[] = [
	{
		name: 'Rick_Sanchez',
		roles: ['admin','owner'],
		id: '0uf',
		profile_picture: rick_sanchez,
		friend: true 
	},
	{
		name: 'monstera',
		roles: ['admin','owner'],
		id: '1ed',
		profile_picture: monstera,
		friend: true
	},
	{
		name: 'ficus lyrata',
		roles: ['classique'],
		id: '2ab',
		profile_picture: lyrata,
		friend: true
	},

	{
		name: 'pothos argenté',
		roles: ['classique'],
		id: '3sd',
		profile_picture: pothos,
		friend: true
	},
	{
		name: 'calathea',
		roles: ['classique'],
		id: '4kk',
		profile_picture: calathea,
		friend: true
	},
	{
		name: 'olivier',
		roles: ['extérieur'],
		id: '5pl',
		profile_picture: olivier,
		friend: true
	},

	{
		name: 'cactus',
		roles: ['plante grasse'],
		id: '8fp',
		profile_picture: cactus,
		friend: true
	},
	{
		name: 'basilique',
		roles: ['extérieur'],
		id: '7ie',
		profile_picture: basil,
		friend: true
	},
	{
		name: 'succulente',
		roles: ['plante grasse'],
		id: '9vn',
		profile_picture: succulent,
		friend: true
	},

	{
		name: 'menthe',
		roles: ['extérieur'],
		id: '6uo',
		profile_picture: mint,
		friend: true
	}
]