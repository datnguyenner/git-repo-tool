
import React from 'react';

const Commit = ({commits}) => {

    const list = commits.map(({ author, commit, html_url }, i) => {
        return (
            <li className="commits" key={i}>
                <div>{commit.message}</div>
                <div>
                    <img src={author && author.avatar_url} width="15" height="15" alt="" />
                    <span>{author ? author.login : commit.author.name}</span> committed on {commit.author.date}
                </div>
                <a href={html_url} target="_blank">link to commit</a>
            </li>
        )
    });

    return list;
}

export default Commit;