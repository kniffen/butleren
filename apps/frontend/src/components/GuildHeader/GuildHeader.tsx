import type { ReactNode } from 'react';
import { useAPI } from '../../provider/hooks/useAPI';
import { Link, useParams } from 'react-router-dom';
import './GuildHeader.scss';

export function GuildHeader(): ReactNode {
  const params = useParams();
  const { guild } = useAPI();

  if (!guild.data) {
    return null;
  }

  return (
    <header className="guild-header">
      <h1 className="guild-header__heading">{guild.data.name}</h1>

      <nav className="guild-nav">
        <Link className={`guild-nav__link ${!params.content ? 'guild-nav__link--active' : ''}`} to={`/guild/${guild.data.id}`}>General</Link>
        <Link className={`guild-nav__link ${'modules' === params.content ? 'guild-nav__link--active' : ''}`} to={`/guild/${guild.data.id}/modules`}>Modules</Link>
        <Link className={`guild-nav__link ${'commands' === params.content ? 'guild-nav__link--active' : ''}`} to={`/guild/${guild.data.id}/commands`}>Commands</Link>
      </nav>
    </header>
  );
};