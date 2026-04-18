import { useEffect, useRef, useState, type JSX } from 'react';
import { useAPI } from '../../provider/hooks/useAPI';
import { User } from '../../types';
import { Card } from '../../components/Card/Card';
import './UsersPage.scss';

export function UsersPage(): JSX.Element {
  const { users } = useAPI();
  const hasFetchedUsers = useRef(false);
  const [usersList, setUsersList] = useState<User[]>([]);

  useEffect(() => {
    if (hasFetchedUsers.current) {
      return;
    }

    hasFetchedUsers.current = true;
    users.getUsers().then(setUsersList);
  }, [users]);

  return (
    <>
      <h1>Users</h1>

      <div className="users">
        {usersList.map((user) => (
          <Card title={user.displayName} key={user.id}>
            <ul className="user-details">
              <li className="user-details__list-item"><b>Id</b><span>{user.id}</span></li>
              <li className="user-details__list-item"><b>Latitude</b><span>{user.settings.lat}</span></li>
              <li className="user-details__list-item"><b>Longitude</b><span>{user.settings.lon}</span></li>
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}