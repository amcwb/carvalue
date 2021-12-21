import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    // fakeUsersService = {
    //   findOne: (id: number) => Promise.resolve({id, email: 'test@example.com', password: 'test'}),
    //   find: () => {},
    //   remove: () => {},
    //   update: () => {}
    // }

    // fakeAuthService = {
    //   signup: () => {},
    //   signin: () => {},
    // }

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
