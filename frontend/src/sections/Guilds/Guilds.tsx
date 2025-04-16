import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAPI } from '../../provider/hooks/useAPI';
import placeholderImage from '../../assets/images/placeholder.png';
import type { Guild } from '../../types';
import './Guilds.scss';

export const Guilds = function():JSX.Element {
  const { guilds } = useAPI();

  return (
    <>
      <h1>Discord guilds</h1>
      <div className="guilds">
        {guilds.map(guild => (<GuildCard key={guild.id} guild={guild} />))}
      </div>
    </>
  );
};

function GuildCard({ guild }: {guild: Guild}): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="guild-card" onClick={() => {
      navigate(`/guild/${guild.id}`);
    }}>
      <img className="guild-card__logo" src={guild.iconURL || placeholderImage} alt="Guild logo" />
      <span className="guild-card__name">{guild.name}</span>
    </div>
  );
};