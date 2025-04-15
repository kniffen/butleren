import { useEffect, useRef } from 'react';
import { useAPI } from '../provider/hooks/useAPI';
import { SiteHeader } from '../sections/SiteHeader/SiteHeader'
import './Layout.scss'

export const Layout = function({children}: {children: React.ReactNode}) {
  const { updateGuilds } = useAPI();
  const hasUpdatedGuilds = useRef(false);

  useEffect(() => {
    if (!hasUpdatedGuilds.current) {
      updateGuilds()
    }
    hasUpdatedGuilds.current = true;
  }, [])

  return (
    <div className="layout">
      <SiteHeader/>
      <main className="main">{children}</main>
    </div>
  );
}

