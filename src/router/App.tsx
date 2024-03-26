import { useOutlet } from "react-router";
import { Link } from "react-router-dom";
import { paths } from "../store";

export default function App() {
	const Outlet = useOutlet();
	return (
		<>
			<header className="bg-primary w-100 d-flex justify-content-center">
			<nav className="d-flex w-75 justify-content-between gap-4 p-4 fs-2">
				{paths.map((path) => (
					<Link 
							key={path}
							className="text-black fw-bold text-capitalize"
							to={`/${path}`}
							>
							{path.replace("stories", " stories")}
						</Link>
				))}
			</nav>
			</header>
			{Outlet}
		</>
	);
}
