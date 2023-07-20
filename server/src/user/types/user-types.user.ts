export type UserByLogin = {
	login : string;
	avatar? : string;
}

export type UserDetails = {
  login: string;
  email: string;
  displayName: string;
  avatar: string;
};

export type UserUpdates = {
  oldNick: string
  login: string;
  mail: string;
  pwd: string;
  atr: string;
}