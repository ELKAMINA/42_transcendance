import monstera from '../assets/profile_pictures/monstera.jpg'
import basil from '../assets/profile_pictures/basil.jpg'

export type ChatElement = ChatMessage | Sep;

export type ChatMessage = {
  type: "msg";
  message: string;
  img?: string;
  preview?: string;
  incoming: boolean;
  outgoing: boolean;
  subtype?: string;
  reply?: string;
};

export type Sep = {
  type: "divider";
  text: string;
};

export const ChatHistory: ChatElement[] = [
	{
	  type: "msg", // can be a message or a divider
	  message: "Hi 👋🏻, How are ya ?",
	  incoming: true,
	  outgoing: false,
	},
	{
	  type: "divider", // divider between two different days
	  text: "Today",
	},
	{
	  type: "msg",
	  message: "Hi 👋 Panda, not bad, u ?",
	  incoming: false,
	  outgoing: true,
	},
	{
	  type: "msg",
	  message: "Can you send me an abstract image?",
	  incoming: false,
	  outgoing: true,
	},
	{
	  type: "msg",
	  message: "Ya sure, sending you a pic",
	  incoming: true,
	  outgoing: false,
	},
	{
	  type: "msg",
	  subtype: "img",
	  message: "Here You Go",
	  img: monstera,
	  incoming: true,
	  outgoing: false,
	},
	{
	  type: "msg",
	  message: "Can you please send this in file format?",
	  incoming: false,
	  outgoing: true,
	},
	{
	  type: "msg",
	  subtype: "doc",
	  message: "Yes sure, here you go.",
	  incoming: true,
	  outgoing: false,
	},
	{
	  type: "msg",
	  subtype: "link",
	  preview: basil,
	  message: "Yep, I can also do that",
	  incoming: true,
	  outgoing: false,
	},
	{
	  type: "msg",
	  subtype: "reply",
	  reply: "This is a reply",
	  message: "Yep, I can also do that",
	  incoming: false,
	  outgoing: true,
	},
  ];
  
  const MessageOptions = [
	{
	  title: "Reply",
	},
	{
	  title: "React to message",
	},
	{
	  title: "Forward message",
	},
	{
	  title: "Star message",
	},
	{
	  title: "Report",
	},
	{
	  title: "Delete Message",
	},
  ];
  