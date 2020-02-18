
import React from 'react';

const SearchBar = ({findRepos, onInputChange}) => {

    return (
        <div className="search">
            <input type="text" placeholder="Organization.." name="search" onChange={onInputChange}/>
            <button type="submit" onClick={findRepos}><i className="fa fa-search"></i></button>
        </div>
    );
}

export default SearchBar;