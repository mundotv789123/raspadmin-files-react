import { useEffect, useState } from "react";
import UsersManager from "../services/admin/UsersManager";
import { User } from "../services/admin/models/UserModels";

export default function Admin() {

  const manager: UsersManager = new UsersManager();

  const [users, setUsers] = useState<Array<User>>(null);

  useEffect(() => {
    manager.getUsers((users) => {
      setUsers(users);
    })
  }, [])

  if (users === null) 
    return <h1>Loading...</h1>

  return (
    <table style={{width: '100%'}}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuário</th>
        </tr>
      </thead>
      <tbody>
        {users && users.map((user, key) => (
          <tr key={key}>
            <td>{user.id}</td>
            <td>{user.username}</td>
          </tr>
         )
        )}
      </tbody>
    </table>
  );
}