import { get, post, put, del, getDataAndTotal } from "../utils/request";

export default {
  main: {
    openSession: (url, name) => post(url + "/sessions", { botName: name }),
    ask: (url, botId, payload) =>
      post(url + `/session/${botId}`, { query: payload })
  }
};
