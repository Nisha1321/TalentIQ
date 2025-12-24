import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

export default function Signup() {
    const [email, setEmail] = useState("");
    const { signup } = useAuth();
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        signup(email || "new@talentiq.ai");
        navigate("/");
    };

    return (
        <div className="auth-wrap">
            <form className="auth-card" onSubmit={onSubmit}>
                <h1>Create your account</h1>
                <input placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Password" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit">Sign up</button>
                <p className="muted">Already have an account? <Link to="/login">Log in</Link></p>
            </form>
        </div>
    );
}
