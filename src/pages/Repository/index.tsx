import React, { useState, useEffect } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import logoImg from '../../assets/logo.svg';

import { Header, RepositoryInfo, Issues } from './styles';

import api from '../../services/api';

interface RepositoryParams {
  repository: string;
}
interface Repository {
  full_name: string;
  description: string;
  owner: {
    avatar_url: string;
    login: string;
  };
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

interface Issue {
  title: string;
  id: number;
  html_url: string;
  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParams>();

  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    api.get(`/repos/${params.repository}`).then(response => {
      const { data } = response;
      setRepository(data);
    });

    api.get(`/repos/${params.repository}/issues`).then(response => {
      const { data } = response;
      setIssues(data);
    });
  }, [params.repository]);

  return (
    <>
      <Header>
        <img src={logoImg} alt="GithubExplorer" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      {repository && (
        <RepositoryInfo>
          <header>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />

            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>

          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Stars</span>
            </li>

            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>

            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues abertas</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      <Issues>
        {issues.map(issue => (
          <a target="__blank" key={issue.id} href={issue.html_url}>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>

            <FiChevronRight size={18} />
          </a>
        ))}
      </Issues>
    </>
  );
};

export default Repository;
