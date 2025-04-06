import { useState, useEffect, useContext } from 'react'
import { Context } from '../Store.jsx'
import DashboardLayout from '../layouts/Dashboard'
import Sidebar from '../sections/Sidebar'
import Box from '../components/Box'

export default function Users() {
  const [users, setUsers] = useState([])
  const { setGuild } = useContext(Context)

  useEffect(function() {
    setGuild(null);

    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  return (<DashboardLayout title={"Users"}>
    <Sidebar />
    {users.map(user => <Box title={user.username} description={user.id} key={user.id}>
      <p>
        <b>Set location: </b>{user.location}
      </p>
    </Box>)}
  </DashboardLayout>);
}