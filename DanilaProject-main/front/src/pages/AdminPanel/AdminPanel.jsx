import { useState } from 'react';
import './AdminPanel.scss';
import AdminGames from '../../component/AdminGames/AdminGames';
import AdminTeams from '../../component/AdminTeams/AdminTeams';
import AdminCategories from '../../component/AdminCategories/AdminCategories';
import AdminUsers from '../../component/AdminUsers/AdminUsers';

const Tabs = {
    GAMES: {
        name: 'games',
        content: <AdminGames />
    },
    TEAMS: {
        name: 'teams',
        content: <AdminTeams />
    },
    USERS: {
        name: 'users',
        content: <AdminUsers />
    },
    CATEGORIES: {
        name: 'categories',
        content: <AdminCategories />
    }
};

const AdminPanel = () => {
    const [selectedTab, setSelectedTab] = useState(Tabs.GAMES);

    return (
        <div className="AdminPanel">
            <div className="AdminPanel-Menu">
                <p
                    className={`AdminPanel-Menu-Items ${selectedTab.name === Tabs.GAMES.name ? 'AdminPanel-Menu-Items_selected' : ''}`}
                    onClick={() => setSelectedTab(Tabs.GAMES)}
                    >
                        Games
                </p>
                <p
                    className={`AdminPanel-Menu-Items ${selectedTab.name === Tabs.CATEGORIES.name ? 'AdminPanel-Menu-Items_selected' : ''}`}
                    onClick={() => setSelectedTab(Tabs.CATEGORIES)}
                >
                    Categories
                </p>
                <p
                    className={`AdminPanel-Menu-Items ${selectedTab.name === Tabs.TEAMS.name ? 'AdminPanel-Menu-Items_selected' : ''}`}
                    onClick={() => setSelectedTab(Tabs.TEAMS)}
                >
                    Teams
                </p>
                <p
                    className={`AdminPanel-Menu-Items ${selectedTab.name === Tabs.USERS.name ? 'AdminPanel-Menu-Items_selected' : ''}`}
                    onClick={() => setSelectedTab(Tabs.USERS)}
                >
                    Users
                </p>
            </div>

            <div className="AdminPanel-Content">
                {selectedTab.content}
            </div>
        </div>
    );
};

export default AdminPanel;