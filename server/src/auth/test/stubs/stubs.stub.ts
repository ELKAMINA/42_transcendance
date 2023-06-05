export const qrCode = 'urlforqrcode';
export const url = 'url';
export const sub = 'idfromjwt';
export const rTok = 'rtoken';
export const aTok = 'aToken';
export const pwd = 'test';
export const pwdHash = 'test';
export const tfaCode = 'TfaCodetest';
export const secret = 'secretTest';
// export const boolFalse = 'false';

export const tokens = {
  aTokens: 'access',
  rToken: 'refresh',
};

export const signing = {
  faEnabled: false,
  tokens: {
    access_token: 'test',
    refresh_token: 'test',
  },
};

export const a = 'mockError';

export const asyncTokens = {
  access_token: 'test',
  refresh_token: 'test',
};

/* user is declared as a function to avoid that the same data could be used by many tests and make them falsy. So everytime, we call user, it a function that create a new user */
export const user = () => {
  return {
    login: 'logintests',
    access_token: tokens.aTokens,
    refresh_token: tokens.rToken,
  };
};

export const newUser = () => {
  return {
    faEnabled: false,
    access_token: 'test',
    refresh_token: 'test',
  };
};

export const falseUser = () => {
  return {
    faEnabled: false,
    access_token: 'lila',
    refresh_token: 'test',
  };
};

export const userInfo = () => {
  return {
    nickname: 'nicktests',
    sub: 'subtests',
  };
};

export const OauthUserInfo = () => {
  return {
    login: 'nicktests',
    email: 'ddd@lokso',
    displayName: 'kikou',
    avatar: 'avatar',
    id: 'subtests',
  };
};

export const userRegistered = () => {
  return {
    login: 'nicktests',
    user_id: 'subtests',
    rtHash: 'dizjdijzd',
    pwd: 'skkssi',
  };
};

export const tfaPayload = {
  login: 'testouille',
  faEnabled: true,
  authTFA: false,
};

export const jsonUrl = { message: 'Mocked url' };

export class DtoTest {
  nickname = 'logintests';

  password = 'pwdTest';

  avatar = 'avatarTest';

  hash = 'hashpwd';
}
