import { useEffect, type JSX } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAPI } from '../../provider/hooks/useAPI';
import type { Guild } from '../../types';
import { GuildInformation } from '../../components/GuildInformation/GuildInformation';
import './Guild.scss';
import { GuildSettings } from '../../components/GuildSettings/GuildSettings';
import { Modules } from '../Modules/Modules';

export function Guild(): JSX.Element {
  const params = useParams();
  const { guild, modules } = useAPI();

  useEffect(() => {
    if (!params.id || guild.data?.id === params.id) {
      return;
    }

    guild.set(params.id);
  }, []);

  return (
    <>
      <GuildHeader />
      <div className="sections">
        <GuildSettings />
        <GuildInformation />
      </div>
      <Modules />
    </>
  );
}

export function GuildHeader(): JSX.Element {
  const { guild } = useAPI();

  return (
    <header className="guild-header">
      <h1  className="guild-header__heading">
        <Link to="/" className="guild-header__link">Guilds: </Link>
        {guild.data?.name}
      </h1>
    </header>
  );
};