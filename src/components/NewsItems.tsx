import { StoryShort } from "../store";
import { Link } from "react-router-dom";
import { relativeTime } from "../utils/time";


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
