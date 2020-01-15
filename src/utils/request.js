function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  // 200 - 300
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  // 400 - 401
  if (response.status === 400 || response.status === 401) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {string} method    The method of HTTP request
 * @param  {string} body      The body of the request
 * @return {object}           An object containing either "data" or "err"
 */
function request(url, method, body) {
  return fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
      // Authorization: localStorage.getItem('token'),
    }
  })
    .then(checkStatus)
    .then(parseJSON)
}

/**
 * Requests a URL, returning a promise with data count.
 *
 * @param  {string} url       The URL we want to request
 * @param  {string} method    The method of HTTP request
 * @param  {string} body      The body of the request
 * @return {object}           An object containing either "data" or "err"
 */
function getDataAndTotal(url, method, body) {
  let headers = {};
  let data = fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    }
  })
    .then(checkStatus)
    .then(response => {
      if (response.headers.get("x-total-count")) {
        headers["count"] = parseInt(response.headers.get("x-total-count"));
      }
      return response;
    })
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => ({ err }));

  return { ...data, headers: headers };
}

const get = url => request(url, "GET");
const post = (url, body) => request(url, "POST", body);
const put = (url, body) => request(url, "PUT", body);
const del = (url, body) => request(url, "DELETE", body);

export { get, post, put, del, getDataAndTotal };
