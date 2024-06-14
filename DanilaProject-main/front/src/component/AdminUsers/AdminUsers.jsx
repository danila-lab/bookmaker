import { useContext, useEffect, useState } from 'react';
import './AdminUsers.scss';
import axios from 'axios';
import Modal from "../Modal/Modal";
import { AdminUsersDetails } from './AdminUsersDetails';
import { AuthContext } from '../../App';
import { format2Num } from '../../util/format';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const { authData } = useContext(AuthContext);
    const [selectedUser, setSelectedUser] = useState({});
    const [search, setSearch] = useState('');

    const openDetails = () => {
        setIsDetailsModalOpen(true);
    }
    const closeDetails = () => {
        updateUsers();
        setIsDetailsModalOpen(false);
    }

    useEffect(() => {
        updateUsers();
    }, []);

    const updateUsers = () => {
        console.log(authData.jwt)
        axios.get('http://localhost:8080/users',{
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            }
        })
            .then(r => {
                setFilteredUsers(r.data);
                setUsers(r.data);
                console.log(r.data);
            }).catch(err => {
                console.log(err);
            });
    };

    const handleDetails = (id) => {
        axios.get('http://localhost:8080/users/info?id=' + id,
        {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
        }).then(r => {
                setSelectedUser(r.data);
                openDetails();
            }).catch(err => {
                console.log(err);
            });
    };

    const handleSearch = () => {
        if (search === '') {
            setFilteredUsers(users);
            return;
        }

        const filtered = users.filter(user => {
            return user.name.toLowerCase().includes(search.toLowerCase())
                || user.email.toLowerCase().includes(search.toLowerCase());
        })

        console.log(filtered);

        setFilteredUsers(filtered);
    }

    const handleResetSearch = () => {
        setSearch('');
        setFilteredUsers(users);
    }

    return (
        <div className="AdminTeams">
            <div style={{display: 'flex', flexDirection: "row", alignItems: "center"}}>
                <div className="AdminTeams-Header">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    <button onClick={handleSearch} className="AdminTeams-Search" />

                </div>

                <button onClick={handleResetSearch} className='Button' style={{height: "40px", marginBottom: "20px", marginLeft: "20px", paddingInline: "30px"}}>Reset</button>
            </div>

            <Modal isOpen={isDetailsModalOpen} close={closeDetails} content={<AdminUsersDetails close={closeDetails} user={selectedUser} />} />
            <table className="AdminTeams-Table">
                <thead className="AdminTeams-Table-Header">
                    <tr>
                        <td>ID</td>
                        <td>Name</td>
                        <td>Email</td>
                        <td>Role</td>
                        <td>Balance</td>
                        <td>Banned</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody className="AdminTeams-Table-Content">
                    {filteredUsers.length > 0 && filteredUsers.map(user =>
                        <tr>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role.name}</td>
                            <td>{user.balance}€</td>
                            <td>{user.is_locked ? 'Yes' : 'No'}</td>
                            <td className="AdminTeams-Table-Content-Action" onClick={() => handleDetails(user.id)}>Details</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;