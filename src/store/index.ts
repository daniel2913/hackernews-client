//topstories.json?print=pretty
import { configureStore } from "@reduxjs/toolkit";
import {
	createApi,
	fetchBaseQuery,
	setupListeners,
} from "@reduxjs/toolkit/query/react";
import { useDispatch, useSelector } from "react-redux";

interface Item {
	id: number;
	time: number;
}

export interface Comment extends Item {
	parent: number;
	kids: number[];
	by: string;
	text: string;
	comments: Comment[];
}

export interface StoryShort extends Item {
	id: number;
	by: string;
	time: number;
	score: number;
	title: string;
}

export interface Story extends StoryShort {
	kids: number[];
	text: string;
	url: string;
	comments: Comment[];
}

export const paths = ["newstories", "topstories", "beststories"] as const;

export function isValidPath(str: string): str is (typeof paths)[number] {
	return paths.includes(str as any);
}

const apiURL = import.meta.env.VITE_API_URL || (window.location.origin + "/api")

export const newsApi = createApi({
	reducerPath: "newsApi",
	tagTypes: [...paths, "story", "comment", "user"],
	baseQuery: fetchBaseQuery({ baseUrl: apiURL }),
	endpoints: (builder) => ({

		getStories: builder.query<StoryShort[], (typeof paths)[number]>({
			query: (listName) => listName,
			providesTags: (_, __, listName) => [listName],
		}),

		refreshStories: builder.mutation<number[], (typeof paths)[number]>({
			query: (listName) => ({
				url: listName,
				method: "POST",
			}),
			invalidatesTags: (_, __, listName) => [listName],
		}),

		getStoryById: builder.query<Story, number>({
			query: (id: number) => `story/${id}`,
			providesTags: (_, __, id) => [{ type: "story", id: +id }],
		}),

		getCommentsById: builder.query<Comment[], number>({
			query: (id: number) => `comments/${id}`,
			providesTags: (_, __, id) => [{ type: "comment", id: +id }],
		}),

		refreshStory: builder.mutation<Story, number>({
			query: (id: number) => ({
				url: `comments/${id}`,
				method: "POST",
			}),
			invalidatesTags: (_, __, id) => [{ type: "story", id: +id }],
		}),
	}),
});

const store = configureStore({
	reducer: {
		[newsApi.reducerPath]: newsApi.reducer,
	},
	middleware(getDefaultMiddleware) {
		return getDefaultMiddleware().concat(newsApi.middleware);
	},
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
	useSelector(selector);

export default store;
setupListeners(store.dispatch);
