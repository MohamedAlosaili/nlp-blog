import moment from "moment";
import "moment/locale/ar";

moment.locale("ar_SA");

export const timeSince = (date: string | Date) => {
  return moment(date).fromNow();
};
