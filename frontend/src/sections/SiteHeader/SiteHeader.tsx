import logo from '../../assets/images/logo.png'
import './SiteHeader.scss'

export const SiteHeader = function() {
  return (
    <header className="site-header">
      <Logo />
    </header>
  );
}

const Logo = () => (
  <div className="logo">
    <img src={logo} alt="Logo"  />
    <span className="logo__text">Butleren</span>
  </div>
);
