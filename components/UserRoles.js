import {useState, useEffect} from 'react'
import {parseCookies} from 'nookies'
import baseUrl from '../helpers/baseUrl'

const UserRoles = () => {
    const {token} = parseCookies()

    const [users, setUsers] = useState([])
    
    useEffect(() => {
       fetchUser()
    }, [])

    const fetchUser = async () => {
      const res = await fetch(`${baseUrl}/api/users`, {
        headers: {
            "Authorization":token
        }
      })
      const data = await res.json()
      console.log(data)
      setUsers(data)
    }

    const handleRole = async (_id, role) => {
        const res = await fetch(`${baseUrl}/api/users`, {
            method: "PUT",
            headers: {
                "Content-Type":"application/json",
                "Authorization":token
            },
            body: JSON.stringify({
                _id,
                role
            })
        })
        const data = await res.json()
        console.log(data)
        const updatedUser = users.map(user => {
            if((user.role !== data.role) && (user.email === data.email)) {
                return data
            } else return user 
        })
        setUsers(updatedUser)
    }

    return (
        <>
            <h1>User Roles</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map(item => {
                        return(
                            <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td onClick={() => handleRole(item._id, item.role)}>{item.role}</td>
                            </tr>
                        )
                    })}
                </tbody>

            </table>
        </>

    )
}

export default UserRoles