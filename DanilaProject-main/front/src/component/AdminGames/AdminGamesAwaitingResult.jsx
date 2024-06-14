import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import { AuthContext } from '../../App';
import './AdminGamesDetails.scss';
import { formatGameDate } from '../../util/format';

export const AdminGamesAwaitingResult = ({ close }) => {
    const [error, setError] = useState('');
    const { authData } = useContext(AuthContext);
    const [games, setGames] = useState([]);

    useEffect(() => {
        fetchGames();
    }, [])

    const fetchGames = () => {
        axios.get('http://localhost:8080/game/awaitingresult')
        .then(r => {
            setGames(r.data);
            console.log(r.data);
        });
    }

    const handleSubmit = (id, team) => {
        axios.post('http://localhost:8080/game/setteamwon', {
            id: id,
            teamWon: team
        },
        {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
    }).then(r => {
            console.log(r.data);
            setError('');
            // close();
            fetchGames();
        }).catch(err => {
            if (err && err.response) {
                setError(err.response.data.error);
            }
        });
    }

    return (
        <div className='AwaitingResult'>
            <div className="Modal-Error">
                {error}
            </div>
            <div className='AwaitingResult-Games-Header'>
                    <p>ID</p>
                    <p>Category</p>
                    <p>Game</p>
                    <p>Start date</p>
                    <p>Finish Date</p>
                    <p>Team Won</p>
                </div>
            <div className='AwaitingResult-Games'>
                {games && games.length > 0 && games.map(game =>
                    <div key={game.id} className='AwaitingResult-Games-Item'>
                        <div className='AwaitingResult-Games-Item-Info'>
                            <p>{game.id}</p>
                            <p>{game.category.name}</p>
                            <p>{game.teamGame1.team.name} vs {game.teamGame2.team.name}</p>
                            <p>{formatGameDate(game.game_start_date)}</p>
                            <p>{formatGameDate(game.game_finish_date)}</p>
                        </div>
                        <div style={{marginLeft: '10px', display: "flex", flexDirection:"row", height: '40px'}}>
                            <button onClick={() => handleSubmit(game.id, 'team1')} className='Button' style={{width: "150px"}}>Team 1</button>
                            <button onClick={() => handleSubmit(game.id, 'team2')} className='Button' style={{width: "150px"}}>Team 2</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminGamesAwaitingResult;