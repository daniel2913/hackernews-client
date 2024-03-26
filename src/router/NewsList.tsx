import { Link, redirect, useFetcher, useParams } from "react-router-dom";
import { type StoryShort, newsApi, isValidPath } from "../store/index";
import Spinner from "react-bootstrap/Spinner";
import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import Button from "react-bootstrap/esm/Button";
import Reload from "../assets/Reload";

dayjs.extend(relative);
const relativeTime = (time: number) => dayjs(time).fromNow();

export function NewsItem(props: StoryShort) {
	return (
		<Link
			preventScrollReset
			className="link-underline link-underline-opacity-0 d-flex justify-content-start align-items-center gap-4 p-2 bg-light rounded"
			to={`/story/${props.id}`}
		>
			<p className="fs-2 newsitem-score text-center text-primary fw-bold">
				{props.score}
			</p>
			<div className="w-100">
				<p className="text-primary fs-2">{props.by}</p>
				<h3 className="fs-3 mb-2">{props.title}</h3>
				<p className="w-100 fs-4 fs-sm-6 text-end">
					{relativeTime(props.time * 1000)}
				</p>
			</div>
		</Link>
	);
}

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
		</main>
	);
}
