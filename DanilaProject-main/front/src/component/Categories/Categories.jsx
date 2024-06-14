import React, {useEffect, useState} from 'react';
import './Categories.scss';
import axios from "axios";

const Categories = ({selectedCategory, changeCategory}) => {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);

    useEffect(() => {
        fetchCategories()
            .then(r => {
                filter(r);
            });
    }, []);

    const fetchCategories = () => {
        return axios.get('http://localhost:8080/categories')
        .then(r => {
            setCategories(r.data);
            console.log(r.data)
            return r.data;
        }).catch(err => {
        console.log(err);
    });
    }

    const handleChangeCategory = (category) => {
        if(category.name === 'all' && categories.length > 0) {
            category.channel_stream = categories[0].channel_stream;
        }
        changeCategory(category);
    }

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }

    const handleSearchClick = () => {
        filter(categories);
    }

    const filter = (c) => {
        if (search.length > 0) {
        setFilteredCategories(c.filter(category => category.name.toLowerCase().startsWith(search.toLowerCase())));
        } else {
            setFilteredCategories(c);
        }

    }

    return (
        <div className="Categories">
            <div className="Categories-Search">
                <input
                    className="Categories-Search-input"
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                />

                <button onClick={handleSearchClick} className="Categories-Search-button"/>
            </div>

            <div className="Categories-List">
                <ul>
                <li
                        className={selectedCategory.name === 'all' ? 'Categories-List_selected-item' : ''}
                        onClick={() => handleChangeCategory({name: 'all'})}
                    >
                        All
                    </li>
                    {filteredCategories.length > 0 && filteredCategories.map(category =>
                        <li
                            onClick={() => handleChangeCategory(category)}
                            key={category.id}
                            className={selectedCategory.name === category.name ? 'Categories-List_selected-item' : ''}
                            style={{display: "flex", alignItems: "center"}}
                        >
                            <img src={category.img} width='70px' style={{marginRight: '20px', background: 'none'}} />

                            {category.name}
                        </li>
                    )}
                </ul>
            </div>

        </div>
    );
};

export default Categories;