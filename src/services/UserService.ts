import { User } from "../entities/User";
import { validate } from "class-validator";
import { getRepository } from "typeorm";


export class UserService {
    public async create(username: string, password: string): Promise<User|Record<string, string>> {
        //Get parameters from the body
        let user = new User();
        user.username = username;
        user.password = password;

        //Validade if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            return Promise.reject({ name: 'UserNotValid', message: 'parameter not valid'});
        }

        //Hash the password, to securely store on DB
        user.hashPassword();

        //Try to save. If fails, the username is already in use
        const userRepository = getRepository(User);
        try {
            await userRepository.save(user);
        } catch (e) {
            return Promise.reject({ name: 'UsernameExist', message: 'username already exist'});
        }

        //If all ok, send 201 response
        return Promise.resolve(user);
    }

    public async getAll(): Promise<User[]> {
        const userRepository = getRepository(User);
        let users:User[] = [];
        try {
            users = await userRepository.find({
                select: ['id','username','createdAt']
            });
        } catch (error) {
            return Promise.reject({message: 'Unable to find the users, Please try again.'});
        }
        //If all ok, send 201 response
        return Promise.resolve(users);
    }

    public async getOne(id:number): Promise<User> {
        const userId = id;
        let user :User;
        try {
            const userRepository = getRepository(User);
            user = await userRepository.findOneOrFail(userId,{
                select: ['id','username','createdAt']
            });
        } catch (error) {
            return Promise.reject({message: 'Unable to find the user, Please try again.'});
        }
        return Promise.resolve(user);
    }
}