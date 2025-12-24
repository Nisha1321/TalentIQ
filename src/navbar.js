import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext"; // or your hook; stub if not used yet
import "./navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    const { isAuthed = false, user = null, logout = () => { } } = useAuth?.() ?? {};

    const onLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="tiq-nav">
            <div className="tiq-nav__inner">
                {/* Brand */}
                <Link to="/" className="tiq-brand">
                    <span className="tiq-dot" />
                    <span>TalentIQ</span>
                </Link>

                {/* Tabs */}
                <nav className="tiq-tabs" aria-label="Primary">
                    <NavLink to="/" end className={({ isActive }) => "tiq-link" + (isActive ? " is-active" : "")}>
                        Home
                    </NavLink>
                    <NavLink to="/jobs" className={({ isActive }) => "tiq-link" + (isActive ? " is-active" : "")}>
                        Jobs
                    </NavLink>
                    <NavLink to="/analytics" className={({ isActive }) => "tiq-link" + (isActive ? " is-active" : "")}>
                        Analytics
                    </NavLink>
                    <NavLink to="/settings" className={({ isActive }) => "tiq-link" + (isActive ? " is-active" : "")}>
                        Settings
                    </NavLink>
                </nav>

                {/* Auth */}
                <div className="tiq-auth">
                    {!isAuthed ? (
                        <>
                            <Link to="/login" className="tiq-btn tiq-btn--ghost">Log in</Link>
                            <Link to="/signup" className="tiq-btn tiq-btn--solid">Sign up</Link>
                        </>
                    ) : (
                        <>
                            <span className="tiq-user">{user?.email ?? "Signed in"}</span>
                            <button className="tiq-btn tiq-btn--ghost" onClick={onLogout}>Sign out</button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
