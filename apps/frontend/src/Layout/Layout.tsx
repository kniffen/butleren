import { useEffect, useRef, type JSX } from 'react';
import { useParams } from 'react-router-dom';
import { useAPI } from '../provider/hooks/useAPI';
import { Sidebar } from '../components/Sidebar/Sidebar';
import './Layout.scss';

export const Layout = function({ children }: {children: React.ReactNode}): JSX.Element {
  const params = useParams();
  const { guilds, guild } = useAPI();
  const hasUpdatedGuilds = useRef(false);

  useEffect(() => {
    if (!hasUpdatedGuilds.current) {
      guilds.update();

      if (params.id) {
        guild.set(params.id);
      }
    }
    hasUpdatedGuilds.current = true;
  }, []);

  return (
    <div className="layout">
      <Sidebar/>
      <main className="main">{children}</main>
    </div>
  );
};

