import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';


describe('AuthService', () => {
    let service: AuthService;
    
    let fakeUsersService: Partial<UsersService>;
    beforeEach(async () => {
        // Create fake usersservice instance
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers: User[] = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 1000), email, password };
                users.push(user);
                return Promise.resolve(user);
            },
        }
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: fakeUsersService }
            ]
        }).compile();

        service = module.get(AuthService);
    });

    it('can create an instance of the auth service', async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('email@email.com', 'asdf');
        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws error if user signs up with email in use', (done) => {
        service.signup('email@email.com', 'pass').then(() => {
            service.signup('email@email.com', 'asdf').catch(e => done());
        })
    });

    it('throws if signin is called with an unused email', done => {
        service.signin('email@email.com', 'adsad').catch(e => done());
    })

    it('throws if signin is called with an invalid password', done => {
        service.signup('email@email.com', 'pass').then(() => {
            service.signin('email@email.com', 'not-pass').catch(e => done());
        });
    })

    it('returns a user if password is valid', async () => {
        await service.signup('email@email.com', 'pass');
        const user = await service.signin('email@email.com', 'pass');
        expect(user).toBeDefined();
    })
})