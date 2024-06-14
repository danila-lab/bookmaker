// import AdminGamesCreate from './AdminGamesCreate';
import { useContext, useEffect, useState } from 'react';
import './AdminCategories.scss';
import axios from 'axios';
import Modal from "../Modal/Modal";
import AdminCategoriesCreate from './AdminCategoriesCreate';
import { AuthContext } from '../../App';
import { handleDeleteImage } from '../../util/filesApi';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { authData } = useContext(AuthContext);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [search, setSearch] = useState('');

    const openCreate = () => {
        setIsCreateModalOpen(true);
    }

    const closeCreate = () => {
        updateTeams();
        setIsCreateModalOpen(false);
        setCategoryToEdit(null);
    }

    useEffect(() => {
        updateTeams();
    }, []);

    const updateTeams = () => {
        axios.get('http://localhost:8080/categories/')
            .then(r => {
                console.log(r.data)
                setCategories(r.data);
                setFilteredCategories(r.data);
            }).catch(err => {
                console.log(err);
            });
    };

    const handleDelete = (category) => {
        if (category?.img) {
            handleDeleteImage(category.img);
        }

        axios.post('http://localhost:8080/categories/delete', {
            id: category.id,
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
        setCategoryToEdit(team);
        setIsCreateModalOpen(true);
    }

    const handleSearch = () => {
        if (search === '') {
            setFilteredCategories(categories);
            return;
        }

        const filtered = categories.filter(category => {
            return category.name.toLowerCase().includes(search.toLowerCase())
        })

        setFilteredCategories(filtered);
    }

    const handleResetSearch = () => {
        setSearch('');
        setFilteredCategories(categories);
    }

    return (
        <div className="AdminTeams">
            <Modal isOpen={isCreateModalOpen} close={closeCreate} content={<AdminCategoriesCreate close={closeCreate} category={categoryToEdit} />}/>

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
                        <td>Twitch channel</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody className="AdminTeams-Table-Content">
                    {filteredCategories.length > 0 && filteredCategories.map(category =>
                        <tr>
                            <td>{category.id}</td>
                            <td style={{width: "200px"}}><img src={category.img} alt="" /></td>
                            <td>{category.name}</td>
                            <td>
                                {category.channel_stream || 'null'}
                            </td>
                            {/* <td className="AdminTeams-Table-Content-Action" onClick={() => handleDelete(category.id)}>DELETE</td> */}
                            <td>
                                <div style={{marginBottom: "20px"}}>
                                    <button className='Button' onClick={() => handleEdit(category)}>EDIT</button>
                                </div>

                                <div>
                                    <button className='Button' onClick={() => handleDelete(category)}>DELETE</button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminCategories;