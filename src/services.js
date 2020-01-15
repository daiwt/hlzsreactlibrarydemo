export default {
  openSession: (payload, url) =>
    fetch(url, {
      method: "POST",
      body: payload
    }),
  ask: (payload, url) =>
    fetch(url, {
      method: "POST",
      body: payload
    })
};
