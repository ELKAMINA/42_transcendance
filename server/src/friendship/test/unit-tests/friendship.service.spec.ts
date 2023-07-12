import { Test, TestingModule } from '@nestjs/testing';
import { FriendshipService } from '../../friendship/friendship.service';

describe('FriendshipService', () => {
  let service: FriendshipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendshipService],
    }).compile();

    service = module.get<FriendshipService>(FriendshipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('AS a user WHEN i want to chat THEN i get an error bc i have no friends ', () => {
    describe('when function signTokens is called', () => {
      let toke;

      beforeEach(async () => {
        toke = await authservice.signTokens(OauthUserInfo().id, user().login);
      });

      test('then it should call jwt signAsync function ', () => {
        expect(jwtservice.signAsync).toHaveBeenCalled();
      });

      test('then it should return an object of tokens', () => {
        expect(toke).toEqual(asyncTokens);
      });
    });
  });

});
