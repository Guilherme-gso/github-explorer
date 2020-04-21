import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Title, Form, Repositories, Error } from './styles';

import api from '../../services/api';
import logoImg from '../../assets/logo.svg';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    avatar_url: string;
    login: string;
  };
}
const Dashboard: React.FC = () => {
  // busca pelos repositorios no localStorage
  const initialRepos = (): Repository[] => {
    const storagedRepositories = localStorage.getItem(
      '@GithubExplorer:repositories'
    );

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    }

    return [];
  };

  const [repositories, setRepositories] = useState<Repository[]>(initialRepos);
  const [newRepository, setNewRepository] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories)
    );
  }, [repositories]);

  async function handleSearchRepositories(
    event: FormEvent<HTMLElement>
  ): Promise<void> {
    event.preventDefault();

    if (newRepository === '') {
      setError('Digite o provedor/nome do repositório para realizar a busca');
      return;
    }

    try {
      const response = await api.get<Repository>(`/repos/${newRepository}`);

      const { data } = response;

      setRepositories([...repositories, data]);

      setNewRepository('');
      setError('');
    } catch (err) {
      setError('Repositório não encontrado, verifique se digitou corretamente');
    }
  }
  return (
    <>
      <img src={logoImg} alt="GithubExplorer" />
      <Title>Explore repositórios no github</Title>

      <Form hasError={!!error} onSubmit={handleSearchRepositories}>
        <input
          value={newRepository}
          type="text"
          placeholder="Digite o nome do repositório"
          onChange={e => setNewRepository(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {error && <Error>{error}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <Link
            key={repository.full_name}
            to={`/repositories/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />

            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={18} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
