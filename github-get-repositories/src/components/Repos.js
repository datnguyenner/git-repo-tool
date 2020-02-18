
import React from 'react';

const Repos = ({ repos, findCommits,  reposNotFound }) => {

    if (!reposNotFound && repos.length) {
        const repoList = repos.map(({ name }) => {
            return <li key={name}><button onClick={findCommits} className="repo">{name}</button></li>
        })

        return (
            <ul>
                {repoList}
            </ul>
        )
    }
    
    return null;
}

export default Repos;