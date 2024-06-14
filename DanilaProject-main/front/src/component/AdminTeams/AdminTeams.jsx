import { useContext, useEffect, useState } from 'react';
import './AdminTeams.scss';
import axios from 'axios';
import Modal from "../Modal/Modal";
import AdminTeamsCreate from './AdminTeamsCreate';
import { AuthContext } from '../../App';
import { handleDeleteImage } from '../../util/filesApi';

const AdminTeams = () => {
    const [teams, setTeams] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { authData } = useContext(AuthContext);
    const [teamToEdit, setTeamToEdit] = useState(null);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [search, setSearch] = useState('');

    const openCreate = () => {
        setIsCreateModalOpen(true);
    }
    const closeCreate = () => {
        updateTeams();
        setIsCreateModalOpen(false);
        setTeamToEdit(null);
    }

    useEffect(() => {
        updateTeams();
    }, []);

    const updateTeams = () => {
        axios.get('http://localhost:8080/team/')
            .then(r => {
                setTeams(r.data);
                setFilteredTeams(r.data);
                console.log(r.data);
            }).catch(err => {
                console.log(err);
            });
    };

    const handleDelete = (team) => {
        if (team?.img) {
            handleDeleteImage(team.img);
        }

        axios.post('http://localhost:8080/team/delete', {
            id: team.id,
        },
        {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
        }).then(r => {
                console.log(r.data);
                updateTeams();
            }).catch(err => {
                console.log(err);
            });
    };

    const handleEdit = (team) => {
        setTeamToEdit(team);
        setIsCreateModalOpen(true);
    }

    const handleSearch = () => {
        if (search === '') {
            setFilteredTeams(teams);
            return;
        }

        const filtered = teams.filter(team => {
            return team.name.toLowerCase().includes(search.toLowerCase())
        })

        setFilteredTeams(filtered);
    }

    const handleResetSearch = () => {
        setSearch('');
        setFilteredTeams(teams);
    }

    return (
        <div className="AdminTeams">
            <Modal isOpen={isCreateModalOpen} close={closeCreate} content={<AdminTeamsCreate close={closeCreate} team={teamToEdit} />}/>

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

            <div className="AdminTeams-Create">
                <button className="Button AdminTeams-Create-button" onClick={openCreate}>Create</button>
            </div>
            <table className="AdminTeams-Table">
                <thead className="AdminTeams-Table-Header">
                    <tr>
                        <td>ID</td>
                        <td>Image</td>
                        <td>Name</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody className="AdminTeams-Table-Content">
                    {filteredTeams.length > 0 && filteredTeams.map(team =>
                        <tr>
                            <td>{team.id}</td>
                            <td style={{width: "200px"}}><img src={team.img} alt="" /></td>
                            <td>{team.name}</td>
                            <td>
                                <div style={{marginBottom: "20px"}}>
                                    <button className='Button' onClick={() => handleEdit(team)}>EDIT</button>
                                </div>

                                <div>
                                    <button className='Button' onClick={() => handleDelete(team)}>DELETE</button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTeams;