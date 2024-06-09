import { ScrollRestoration, redirect, useParams } from "react-router-dom";
import { newsApi, isValidPath } from "../store/index";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/esm/Button";
import Reload from "../assets/Reload";
import { NewsItem } from "../components/NewsItems";


export default function NewsList() {
	const path = useParams().path || "newstories";
	if (!isValidPath(path)) {
		redirect("/newstories");
		return;
	}
	const {
		data: news,
		isFetching,
		isLoading,
	} = newsApi.useGetStoriesQuery(path, {
		pollingInterval: 1000 * 60,
		refetchOnMountOrArgChange: 1000 * 60,
	});

	const [refresh, { isLoading: isRefreshing }] =
		newsApi.useRefreshStoriesMutation();
	if (isLoading || !news) return <Spinner />;
	return (
		<main className="p-4 d-flex justify-content-center">
			<Button
				className={
					"position-fixed bg-primary border-0 rounded-circle end-0 bottom-0 me-4 mb-4"
				}
				disabled={isFetching || isRefreshing}
				onClick={() => refresh(path)}
			>
				<Reload
					width={60}
					className={(isFetching || isRefreshing || "") && "spin"}
				/>
			</Button>
			<ul className="d-flex w-75 flex-column ps-0 gap-4">
				{news.map((story) => (
					<li className="mb-4 w-100" key={story.id}>
						<NewsItem {...story} />
					</li>
				))}
			</ul>
			<ScrollRestoration/>
		</main>
	);
}
