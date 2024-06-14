import './AdminGames.scss';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import Modal from "../Modal/Modal";
import {formatGameDate} from "../../util/format";
import AdminGamesCreate from './AdminGamesCreate';
import AdminGamesDetails from './AdminGamesDetails';
import AdminGamesAwaitingResult from './AdminGamesAwaitingResult';

const AdminGames = () => {
    const [selectedType, setSelectedType] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [games, setGames] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAwaitingResultOpen, setIsAwaitingResultOpen] = useState(false);
    const [gamesStatus, setGamesStatus] = useState("1");
    const [selectedGame, setSelectedGame] = useState(null);
    const [sort, setSort] = useState(null);

    const openCreate = () => {
        setIsCreateModalOpen(true);
    }
    const closeCreate = () => {
        fetchGames();
        setIsCreateModalOpen(false);
    }

    const openDetails = (game) => {
        setSelectedGame(game);
        setIsDetailsModalOpen(true);
    }
    const closeDetails = () => {
        fetchGames();
        setIsDetailsModalOpen(false);
    }

    const openAwaitingResults = () => {
        setIsAwaitingResultOpen(true);
    }
    const closeAwaitingResults = () => {
        setIsAwaitingResultOpen(false);
    }


    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchGames();
    }, [selectedCategory, selectedType, gamesStatus, sort]);

    const fetchGames = () => {
        if(selectedType) {
            const s = sort?.split('_') || null;
            const sortBy = s && s[0];
            const order = s && s[1];
            axios.get(`http://localhost:8080/game?category=${selectedCategory}&type=${selectedType}&is_active=${gamesStatus}&sort=${sortBy}&order=${order}`)
            .then((r) => {
                setGames(r.data);
                console.log(r.data);
            }).catch((err) => {
            console.log(err);
        })
        }
    };

    const fetchCategories = () => {
        axios.get('http://localhost:8080/categories')
            .then(r => {
                setCategories(r.data);
            }).catch(err => {
            console.log(err);
        });
    }

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    }

    const handleGameTypeChange = (e) => {
        setSelectedType(e.target.value);
    }

    const handleGameStatusChange = (e) => {
        setGamesStatus(e.target.value);
    }

    const handleSortChange = (e) => {
        setSort(e.target.value)
    }


    return (
        <div className="AdminGames">
            <Modal isOpen={isCreateModalOpen} close={closeCreate} content={<AdminGamesCreate close={closeCreate} />}/>
            <Modal isOpen={isDetailsModalOpen} close={closeDetails} content={<AdminGamesDetails close={closeDetails} game={selectedGame} />}/>
            <Modal isOpen={isAwaitingResultOpen} close={closeAwaitingResults} content={<AdminGamesAwaitingResult close={closeAwaitingResults} />}/>
            <div className="AdminGames-Header">
                <div className="AdminGames-Header-Left">
                    <select className="Select_secondary" onChange={handleGameTypeChange}>
                        <option value="" disabled selected>Game Type</option>
                        <option value="manual">Live</option>
                        <option value="auto">Prematch</option>
                    </select>

                    <select className="Select_secondary" onChange={handleCategoryChange}>
                        <option value="" disabled selected>Category</option>
                        {categories.length > 0 && categories.map(category =>
                            <option value={category.name}>{category.name}</option>
                        )}
                    </select>

                    <select className="Select_secondary" onChange={handleGameStatusChange}>
                        <option value="1" selected>Active Games</option>
                        <option value="0">History</option>
                    </select>

                    <select className='Select_secondary' style={{width: "200px"}} value={sort} onChange={handleSortChange}>
                        <option value={null} disabled selected>Sort</option>
                        <option value="id_desc">Newest</option>
                        <option value="id_asc">Oldest</option>
                        <option value="team1_asc">Team1 Odd: Low to High</option>
                        <option value="team1_desc">Team1 Odd: High to Low</option>
                        <option value="team2_asc">Team2 Odd: Low to High</option>
                        <option value="team2_desc">Team2 Odd: High to Low</option>
                        <option value="startDate_desc">StartDate: Descending</option>
                        <option value="startDate_asc">Start Date: Ascending</option>
                        <option value="finishDate_desc">Finish Date: Descending</option>
                        <option value="finishDate_asc">Finish Date: Ascending</option>
                    </select>
                </div>

                <div className="AdminGames-Header-Right">
                    <button className="Button_secondary" style={{paddingInline: "20px", width: "auto", marginRight: "40px"}} onClick={openAwaitingResults}>Awaiting result</button>
                    <button className="Button" onClick={openCreate}>Create</button>
                </div>
            </div>

            <div className="AdminGames-Content">
            <table className="AdminTeams-Table">
                <thead className="AdminTeams-Table-Header">
                    <tr>
                        <td>ID</td>
                        <td>Category</td>
                        <td>Game</td>
                        <td>Team-1 odd</td>
                        <td>Team-2 odd</td>
                        <td>Start date</td>
                        <td>Finish date</td>
                        {gamesStatus === "1" && <td>Bets open</td>}
                        <td>Action</td>
                    </tr>
                </thead>
                {!selectedType &&
                    <h1 style={{ position: "absolute", textAlign: "center", marginLeft: "50px", marginTop: "20px", fontSize: "28px"}}>Please select Game Type</h1>
                }
                <tbody className="AdminTeams-Table-Content">
                    {games.length > 0 && games.map(game =>
                        <tr>
                            <td>{game.id}</td>
                            <td>{game.category.name}</td>
                            <td>{game.teamGame1.team.name} vs {game.teamGame2.team.name}</td>
                            <td className="fw-800">x{game.teamGame1.coefficient}</td>
                            <td className="fw-800">x{game.teamGame2.coefficient}</td>
                            <td>{formatGameDate(game.game_start_date)}</td>
                            <td>{formatGameDate(game.game_finish_date)}</td>
                            {gamesStatus === "1" && <td>{game.is_bets_open ? 'Yes' : 'No'}</td>}
                            <td className="AdminGames-Table-Content-Details" onClick={() => openDetails(game)}>Details</td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default AdminGames;