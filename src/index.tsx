import { createRoot } from "react-dom/client";
import "./index.scss";
import { RouterProvider, ScrollRestoration } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/index";
import Router from "./router/Router";


const div = document.getElementById("App");
if (!div) throw "No root?";
const root = createRoot(div);
root.render(
	<Provider store={store}>
		<RouterProvider router={Router}>
			<ScrollRestoration/>
		</RouterProvider>
	</Provider>,
);

