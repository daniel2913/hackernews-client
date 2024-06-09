import { redirect, useNavigate, useParams } from "react-router";
import { newsApi, paths} from "../store/index";
import { Button, Spinner } from "react-bootstrap";
import Reload from "../assets/Reload";
import { CommentItem } from "../components/CommentItem";
import { relativeTime } from "../utils/time";


export default function NewsPage() {
	const id = +(useParams().id||0);
	if (id===0){
		redirect(`/${paths[0]}`)
	}
	const { data: story, isLoading: isLoadingStory } =
		newsApi.useGetStoryByIdQuery(id);
	const { data: comments, isLoading } = newsApi.useGetCommentsByIdQuery(id, {
		pollingInterval: 60 * 1000,
		refetchOnMountOrArgChange: 60 * 1000,
	});

	const [trigger, { isLoading: isUpdating }] =
		newsApi.useRefreshStoryMutation();
	function refresh() {
		if (story) trigger(id);
	}
	const navigate = useNavigate();

	if (isLoadingStory || !story) return <Spinner />;
	return (
		<main className="p-4 d-flex position-relative flex-column align-items-center w-100">
			<Button
				onClick={() => navigate(-1)}
				variant="light"
				className="bg-light sticky-top fs-4 align-self-start text-white rounded top-0 start-0"
			>
				Back
			</Button>
			<Button
				className={
					"position-fixed bg-primary border-0 rounded-circle end-0 bottom-0 me-4 mb-4"
				}
				disabled={isLoading || isUpdating}
				onClick={() => refresh()}
			>
				<Reload
					width={60}
					className={(isLoading || isUpdating || "") && "spin"}
				/>
			</Button>
			<header className="bg-light rounded w-75 p-3 mb-4">
				<h1 className="fs-1">{story.title}</h1>
				<div className="d-flex fs-2 justify-content-between">
					<p className="text-primary">{story.by}</p>
					<span>
						<time>{relativeTime(story.time * 1000)}</time>
					</span>
				</div>
				<a href={story.url}>{story.url}</a>
				<p className="fs-4">{story.text}</p>
				<p className="fs-1 text-primary fw-bold text-end mb-4">{story.score}</p>
			</header>
			<ul className="d-flex flex-column w-75 row-gap-4 ps-0 ">
				{isLoading || !comments ? (
					<Spinner />
				) : (
					comments.map((comment) => (
						<li className="mb-3" key={comment.id}>
							<CommentItem comment={comment} depth={0} />
						</li>
					))
				)}
			</ul>
		</main>
	);
}
