import { useEffect, useRef, type JSX } from 'react';
import { useAPI } from '../provider/hooks/useAPI';
import { SiteHeader } from '../sections/SiteHeader/SiteHeader';
import './Layout.scss';

export const Layout = function({ children }: {children: React.ReactNode}): JSX.Element {
  const { updateGuilds } = useAPI();
  const hasUpdatedGuilds = useRef(false);

  useEffect(() => {
    if (!hasUpdatedGuilds.current) {
      updateGuilds();
    }
    hasUpdatedGuilds.current = true;
  }, []);

  return (
    <div className="layout">
      <SiteHeader/>
      <main className="main">{children}</main>
    </div>
  );
};

