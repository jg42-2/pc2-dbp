import {Link, Navigate, Outlet, useNavigate} from "react-router-dom";
import {HOME, TITLE, EXTRA} from "../caso";

export default function PrivateLayout (){
    const navigate = useNavigate();
    if (!localStorage.getItem("token")) return <Navigate to= "/login" replace/>

   const logout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};

    return(
        <div className="mx-auto max-w-3xl space-y-4 p-4">
            <header className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <nav className="flex flex-wrap items-center gap-4">
                    <Link to={HOME} className="text-lg font-bold">{TITLE}</Link>
                        {EXTRA.map((v) => <Link key={v.path} to={v.path} className="text-blue-600 underline">{v.label}</Link>)}
                </nav>
                <button onClick={logout}>Cerrar sesión</button>
            </header>
            <Outlet />
        </div>
    )
};