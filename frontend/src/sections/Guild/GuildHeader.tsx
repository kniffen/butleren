import { Link } from "react-router-dom";
import { useAPI } from "../../provider/hooks/useAPI";
import './Guild.scss'

export const GuildHeader = () => {
  const { guild } = useAPI();

  return (
    <header className="guild-header">
      <h1  className="guild-header__heading">
        <Link to="/" className="guild-header__link">Guilds: </Link>
        {guild?.name}
      </h1>
    </header>
  );
 }