
import React from 'react';
import Commit from './Commit';
import Pagination from 'react-js-pagination';

const displayCommitPagination = (commits, activePageCommit, lastPageNumCommit, handlePageChangeCommit) => {
    if (commits.length) {
        return (
            <Pagination
                activePage={activePageCommit}
                itemsCountPerPage={30}
                totalItemsCount={30 * lastPageNumCommit}
                pageRangeDisplayed={5}
                onChange={handlePageChangeCommit}
            />
        )
    }
}

const Commits = ({ states, handlePageChangeCommit }) => {

    let { commits, selectedRepo, activePageCommit, lastPageNumCommit } = states;
    if (commits.length) {
        return (
            <div className="column two">
                <h2>{selectedRepo}</h2>
                <ul>
                    <Commit commits={commits} />
                </ul>
                {displayCommitPagination(commits, activePageCommit, lastPageNumCommit, handlePageChangeCommit)}
            </div>
        )
    }
    return null;
}

export default Commits;