import React, { Component } from 'react';
import Particles from 'react-particles-js';
import SearchBar from './components/SearchBar'
import './App.css';
import { Octokit } from '@octokit/rest';
import Pagination from 'react-js-pagination';
import Commits from './components/Commits';
import Repos from './components/Repos'

const octokit = new Octokit({ auth: '52ade2032c495a5d181acd0abaada5ce3febefd0' });

const particlesOptions = {
  particles: {
    number: {
      value: 20,
      density: {
        enable: true,
        value_area: 1000
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.initialState = {
      org: '',
      owner: '',
      repos: [],
      commits: [],
      avatar: '',
      selectedRepo: '',
      activePageRepo: 1,
      activePageCommit: 1,
      lastPageNumRepo: 0,
      lastPageNumCommit: 0,
      allRepos: [],
      reposNotFound: false
    }
    this.state = { ...this.initialState }
  }

  onInputChange = (e) => {
    this.setState({ org: e.target.value, reposNotFound: false })
  }

  findCommits = async (e) => {
    e.preventDefault();
    const repo = e.target.innerHTML;
    let response = await octokit.repos.listCommits({
      owner: this.state.owner,
      repo
    });

    if (response.data.length) {
      if (response.headers.link) {
        let links = response.headers.link.split(',');
        const lastPageNumCommit = this.getPageFromLink(links);
        this.setState({ lastPageNumCommit });

      }
      this.setState({ commits: [...response.data], selectedRepo: repo });
    }
  }

  getPageFromLink = (links) => {

    let link = links[1].split(';');
    console.log(link)
    let index = link[0].lastIndexOf('page');

    return parseInt(link[0].substring(index + 5, link[0].length - 1));
  }

  findRepos = async (e) => {
    e.preventDefault();
    try {
      let response = await octokit.repos.listForOrg({
        org: this.state.org,
        type: "all"
      })
      let repos = response.data;
      if (repos.length) {
        let links = response.headers.link.split(',');
        const lastPageNumRepo = this.getPageFromLink(links);
        let newState = { ...this.initialState, repos: [...repos], org: this.state.org, owner: this.state.org, avatar: repos[0].owner.avatar_url, lastPageNumRepo };

        this.setState(newState);
        this.paginateRepos();
      }
    } catch (e) {
      this.setState({ reposNotFound: true });
    }
  }

  handlePageChangeRepo = (pageNumber) => {
    console.log(`active page is ${pageNumber}`);
    let startIndex = (30 * pageNumber) - 30, endIndex = 30 * pageNumber;
    this.setState({ repos: this.state.allRepos.slice(startIndex, endIndex), activePageRepo: pageNumber });
  }

  handlePageChangeCommit = async (pageNumber) => {
    console.log(`active page is ${pageNumber}`);
    let response = await octokit.repos.listCommits({
      owner: this.state.owner,
      repo: this.state.selectedRepo,
      page: pageNumber
    });

    if (response.data.length) {
      this.setState({ commits: [...response.data], activePageCommit: pageNumber });
    }
  }

  paginateRepos = async () => {
    const options = octokit.repos.listForOrg.endpoint.merge({
      org: this.state.org,
      type: "all"
    })

    let allRepos = await octokit.paginate(options);
    allRepos = allRepos.map(({ name, forks_count }) => {
      return { name, forks_count };
    })

    this.setState({ allRepos: [...allRepos] });

  }

  displayRepoPagination = () => {
    if (!this.state.reposNotFound && this.state.allRepos.length) {
      return (
        <Pagination
          activePage={this.state.activePageRepo}
          itemsCountPerPage={30}
          totalItemsCount={30 * this.state.lastPageNumRepo}
          pageRangeDisplayed={5}
          onChange={this.handlePageChangeRepo}
        />
      )
    }
  }

  showError = () => {
    if (this.state.reposNotFound) {
      return <h4>There are no repositories for {this.state.org}</h4>
    }
  }

  sortByForkCount = (e) => {
    let allRepos = this.state.allRepos;
    if (e.target.value === 'most') {
      allRepos.sort((a, b) => b.forks_count - a.forks_count);
      this.setState({ allRepos: [...allRepos] });
      this.handlePageChangeRepo(1);
    }
    if (e.target.value === 'least') {
      allRepos.sort((a, b) => a.forks_count - b.forks_count);
      this.setState({ allRepos: [...allRepos] });
      this.handlePageChangeRepo(1);
    }
  }

  loadingAllData = () => {
    if (this.state.allRepos.length) {
      return (
        <div>
          <label htmlFor="rank">Rank by:</label>
          <select id="rank" onChange={this.sortByForkCount}>
            <option value="...">select...</option>
            <option value="most">most popular</option>
            <option value="least">least popular</option>
          </select>
        </div>
      )
    } else if(this.state.repos.length){
        return <div className="loader"></div>
    }
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <div className="container">
          <div className="column one">
            <SearchBar onInputChange={this.onInputChange} findRepos={this.findRepos} />
            {this.showError()}
            {this.loadingAllData()}
            <img className="logo" src={this.state.reposNotFound ? '' : this.state.avatar} width="100" height="100" alt="" />
            <Repos repos={this.state.repos} findCommits={this.findCommits} reposNotFound={this.state.reposNotFound} />
            {this.displayRepoPagination()}
          </div>
          <Commits states={this.state} handlePageChangeCommit={this.handlePageChangeCommit} />
        </div>
      </div>
    );
  }
}

export default App;