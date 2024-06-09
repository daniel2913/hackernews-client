import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";

dayjs.extend(relative);
export const relativeTime = (time: number) => dayjs(time).fromNow();
