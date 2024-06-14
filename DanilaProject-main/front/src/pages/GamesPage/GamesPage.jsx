import React, { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import './GamesPage.scss';
import Categories from "../../component/Categories/Categories";
import Games from "../../component/Games/Games";
import { AuthContext } from '../../App';
import axios from 'axios';

const GamesPage = () => {
    const params = useParams();
    const { type } = params;
    const [selectedCategory, setSelectedCategory] = useState({ name: 'all' });
    const { fetchNewUserData } = useContext(AuthContext);

    useEffect(() => {
        fetchNewUserData();
    }, []);

    const changeCategory = (category) => {
        setSelectedCategory(category);
    }

    const [img, setImg] = useState(null);

    const uploadImage = (e) => {
        const file = e.target.files[0];
        setImg(file);
    }

    const handleSaveImage = async () => {
        const formData = new FormData();
        formData.append('image', img);

        try {
            const response = await axios.post('http://localhost:8080/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className="GamesPage">
            <div className="GamesPage-Categories">
                <Categories selectedCategory={selectedCategory} changeCategory={changeCategory} />
            </div>

            <div className="GamesPage-Games">
                <Games type={type} category={selectedCategory} />
            </div>
        </div>
    );
};

export default GamesPage;
