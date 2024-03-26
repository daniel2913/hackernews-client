import { createBrowserRouter, redirect } from "react-router-dom";
import store, { isValidPath, newsApi, paths } from "../store";
import App from "./App";
import NewsList from "./NewsList";
import NewsPage from "./NewsPage";

export default createBrowserRouter([
	{
		path: "/",
		Component: App,
		children: [
			{
				path: "/:path",
				index: true,
				Component: NewsList,
				loader: async (args) => {
					if (!args.params.path || !isValidPath(args.params.path)) {
						redirect(`/${paths[0]}`);
						return;
					}
					const promise = store.dispatch(
						newsApi.endpoints.getStories.initiate(args.params.path),
					);
					const { unsubscribe } = promise;
					await promise;
					unsubscribe();
					return null;
				},
			},
			{
				path: "/story/:id",
				Component: NewsPage,
				loader: async (args) => {
					if (!args.params.id) {
						redirect("/");
						return;
					}
					const storyPromise = store.dispatch(
						newsApi.endpoints.getStoryById.initiate(+args.params.id),
					);
					const commentsPromise = store.dispatch(
						newsApi.endpoints.getCommentsById.initiate(+args.params.id),
					);
					const { unsubscribe } = storyPromise;
					await storyPromise;
					unsubscribe();
					commentsPromise.unsubscribe()
					return null
				},
			},
		],
	},
]);
