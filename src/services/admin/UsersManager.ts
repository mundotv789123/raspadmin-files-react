import HttpClient from "../HttpClient";
import { User } from "./models/UserModels";

export default class UsersManager {
    constructor(private client = new HttpClient()) { }

    getUsers(callback: (users: Array<User>) => void) {
        this.client.api.get<Array<User>>('/admin/users').then((response) => {
            callback(response.data);
        }) 
    }
}