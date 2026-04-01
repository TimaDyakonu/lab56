import { NavLink, Outlet } from "react-router";

function App() {
    return (
        <div className="app">
            <nav className="nav">
                <NavLink to="/tasks">Tasks</NavLink>
                <NavLink to="/email">Email</NavLink>
            </nav>
            <main className="main">
                <Outlet />
            </main>
        </div>
    );
}

export default App;