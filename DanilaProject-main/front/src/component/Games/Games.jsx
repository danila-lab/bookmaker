import React, {useEffect, useState, useContext} from 'react';
import './Games.scss';
import axios from "axios";
import BetsPanel from "../BetsPanel/BetsPanel";
import {formatGameDate} from "../../util/format";
import { Navigate, useNavigate } from 'react-router-dom';
import {AuthContext} from "../../App";

const Games = ({type, category}) => {
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [selectedType, setSelectedType] = useState('auto');
    const [selectedBet, setSelectedBet] = useState(null);
    const [sort, setSort] = useState(null);
    const { authData, setIsLoginOpen } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGames()
    }, [category, selectedType, sort]);

    const fetchGames = () => {
        console.log(category.name);
        console.log(selectedType);
        const s = sort?.split('_') || null;
        const sortBy = s && s[0];
        const order = s && s[1];
        axios.get(`http://localhost:8080/game?category=${category.name}&type=${selectedType}&is_active=1&sort=${sortBy}&order=${order}`)
        .then((r) => {
            setGames(r.data);
            console.log(r.data);
        }).catch((err) => {
        console.log(err);
        });
    }

    const handleBetClick = (e, game, teamGame) => {
        const clickedButton = e.target;

        if (selectedBet) {
            selectedBet.style.backgroundColor = '#ffcf49';
        }

        clickedButton.style.backgroundColor = '#e06c51';
        setSelectedBet(clickedButton);

        const updatedGame = {
            ...game,
            selectedTeam: teamGame,
        }
        setSelectedGame(updatedGame);
        console.log(updatedGame)
    }

    const handleTypeChange = (type) => {
        setSelectedType(type);
    }

    const clearBet = () => {
        fetchGames();
        setSelectedBet(null);
        if (selectedBet) {
            selectedBet.style.backgroundColor = '#ffcf49';
        }
        setSelectedGame(null);
    }

    const handleSortChange = (e) => {
        setSort(e.target.value)
    }

    const handleDepositClick = () => {
        if(!authData.id) {
            setIsLoginOpen(true);
            return;
        }

        navigate('/profile?deposit=true')
    }

    return (
        <div className="Games">
            <div className="Games-Main">
                <div className="Games-Main-Top">
                    <div className="Games-Main-Top-Stream">
                        <iframe
                            title='twitch'
                            src={`https://player.twitch.tv/?channel=${category.channel_stream}&parent=localhost`}
                            allowFullScreen
                        ></iframe>
                    </div>

                    <div className="Games-Main-Top-info" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around"}}>
                        <div>
                        <div style={{display:"flex"}}>
                            <div style={{ display:"flex", justifyContent: "center", alignItems: "center", color: "black", fontWeight: 800, width: "40px", height: "40px", borderRadius: "20px", backgroundColor: "#ffcf49"}}>1</div>
                            <div style={{marginLeft: "20px", width: "80%"}}>
                                <p style={{ fontWeight: 700 }}>Select an event</p>
                                <p style={{textWrap: "wrap"}}>Select an event and click on the odds. Example: “Win1” means the home team wins.</p>
                            </div>
                        </div>

                        <div style={{display:"flex", marginTop: "50px"}}>
                            <div style={{ display:"flex", justifyContent: "center", alignItems: "center", color: "black", fontWeight: 800, width: "40px", height: "40px", borderRadius: "20px", backgroundColor: "#ffcf49"}}>2</div>
                            <div style={{marginLeft: "20px", width: "80%"}}>
                                <p style={{ fontWeight: 700 }}>Place your bet</p>
                                <p style={{textWrap: "wrap"}}>Enter the amount and the system will calculate the possible winnings, then click “Place a bet”.</p>
                            </div>
                        </div>
                        </div>
                        <button onClick={handleDepositClick} className='Button' style={{width: "80%", height: "40px"}}>Deposit</button>
                    </div>
                </div>
                <div className="Games-Main-Type">
                    <button
                        className={`Button_secondary ${selectedType === 'auto' ? 'Button_secondary_selected' : ''}`}
                        onClick={() => handleTypeChange('auto')}
                    >
                        Prematch
                    </button>
                    <button
                        className={`Button_secondary ${selectedType === 'manual' ? 'Button_secondary_selected' : ''}`}
                        onClick={() => handleTypeChange('manual')}
                    >
                        Live
                    </button>
                </div>
                <div className="Games-Main-Items">
                <select className='Select_secondary' style={{width: "200px", marginBottom: "20px"}} value={sort} onChange={handleSortChange}>
                        <option value={null} disabled selected>Sort</option>
                        <option value="id_desc">Newest</option>
                        <option value="id_asc">Oldest</option>
                        <option value="team1_asc">Team1 Odd: Low to High</option>
                        <option value="team1_desc">Team1 Odd: High to Low</option>
                        <option value="team2_asc">Team2 Odd: Low to High</option>
                        <option value="team2_desc">Team2 Odd: High to Low</option>
                        <option value="startDate_desc">StartDate: Descending</option>
                        <option value="startDate_asc">Start Date: Ascending</option>
                    </select>
                {games.length > 0 && games.map(game =>
                        <table key={game.id} className="Games-Main-Items-Game">
                            <tr className="Games-Main-Items-Game-Header">
                                <td>Game</td>
                                <td>Start date: {formatGameDate(game.game_start_date)}</td>
                                <td>Team 1</td>
                                <td>Team 2</td>
                                <td>Info</td>
                            </tr>
                            <tr className="Games-Main-Items-Game-Content">
                                <td>
                                    {game.category.name}
                                </td>
                                <td style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                    <img src={game.teamGame1.team.img} alt="" style={{ width: "50px", marginRight: "10px" }} />
                                    <p>{game.teamGame1.team.name} vs {game.teamGame2.team.name}</p>
                                    <img src={game.teamGame2.team.img} alt="" style={{ width: "50px", marginLeft: "10px" }} />
                                </td>
                                <td>
                                    <button
                                        onClick={(e) => handleBetClick(e, game, game.teamGame1)}
                                        className="Button Games-Main-Items-Game-Content-Coefficient"
                                    >
                                        x{parseFloat(game.teamGame1.coefficient.toFixed(2))}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={(e) => handleBetClick(e, game, game.teamGame2)}
                                        className="Button Games-Main-Items-Game-Content-Coefficient"
                                    >
                                        x{parseFloat(game.teamGame2.coefficient.toFixed(2))}
                                    </button>
                                </td>
                                <td>
                                    <button className="Button_secondary">Details</button>
                                </td>
                            </tr>
                        </table>
                    )}
                </div>
            </div>

            <div className="Games-BetsPanel">
                <BetsPanel bet={selectedGame} close={clearBet}/>
            </div>
        </div>
    );
};

export default Games;