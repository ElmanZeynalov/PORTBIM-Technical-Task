import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
	return (
		<div className="app-layout">
			<header className="app-header">
				<div className="header-brand">
					<span className="brand-icon">◆</span>
					<h1>Dashboard 3D</h1>
				</div>
				<nav className="header-nav">
					<NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
						<span className="nav-icon">👥</span>
						Designers
					</NavLink>
					<NavLink to="/editor" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
						<span className="nav-icon">🎨</span>
						Editor
					</NavLink>
				</nav>
			</header>
			<main className="app-main">
				<Outlet />
			</main>
		</div>
	);
}
