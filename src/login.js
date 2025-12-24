import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        login(email || "demo@talentiq.ai");
        navigate("/");
    };

    return (
        <div className="auth-wrap">
            <form className="auth-card" onSubmit={onSubmit}>
                <h1>Welcome back</h1>
                <input placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Password" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit">Log in</button>
                <p className="muted">No account? <Link to="/signup">Sign up</Link></p>
            </form>
        </div>
    );
}
