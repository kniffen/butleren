import type { JSX } from 'react';
import logo from '../../assets/images/logo.png';
import './SiteHeader.scss';

export const SiteHeader = function(): JSX.Element {
  return (
    <header className="site-header">
      <Logo />
    </header>
  );
};

function Logo(): JSX.Element {
  return(
    <div className="logo">
      <img src={logo} alt="Logo"  />
      <span className="logo__text">Butleren</span>
    </div>
  );
};
