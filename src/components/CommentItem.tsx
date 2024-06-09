import React from "react";
import { Comment, newsApi } from "../store";
import { relativeTime } from "../utils/time";
import Spinner from "react-bootstrap/esm/Spinner";
import Button from "react-bootstrap/esm/Button";


type CommentItemProps = {
	comment: Comment;
	depth: number;
};

export function CommentItem({ comment, depth }: CommentItemProps) {
	const [expanded, setExpanded] = React.useState(false);
	const [trigger, { data: comments, isLoading }] =
		newsApi.useLazyGetCommentsByIdQuery({ pollingInterval: 1000 * 60 });
	function clickHandler() {
		setExpanded((s) => !s);
		if (!expanded && !comments) trigger(comment.id);
	}
	return (
		<article className="p-4 rounded bg-light text-white">
			<header className="fs-3 d-flex justify-content-between mb-2">
				<span className="text-primary">{comment.by}</span>
				<span>{relativeTime(comment.time * 1000)}</span>
			</header>
			<p className="fs-4" dangerouslySetInnerHTML={{ __html: comment.text }} />
			{comment.kids?.length && (
				<div className="border-start border-white">
					<div>
						{expanded ? (
							isLoading ? (
								<Spinner />
							) : (
								<ul className="ps-1">
									{comments?.map((comment) => (
										<li>
											<CommentItem comment={comment} depth={depth + 1} />
										</li>
									))}
								</ul>
							)
						) : (
							<>
								<Button
									onClick={clickHandler}
									className="rotate-90 ms-2 mt-4 border-0 bg-primary rounded-full"
								>
									{comment.kids.length} Replies{" "}
								</Button>
							</>
						)}
					</div>
				</div>
			)}
		</article>
	);
}
