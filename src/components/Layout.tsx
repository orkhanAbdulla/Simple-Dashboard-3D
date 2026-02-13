import { NavLink, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="app-layout">
      <nav className="sidebar" aria-label="Main navigation">
        <h2>Dashboard 3D</h2>
        <NavLink to="/designers" aria-label="Designers page">Designers</NavLink>
        <NavLink to="/editor" aria-label="3D Editor page">Editor</NavLink>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
