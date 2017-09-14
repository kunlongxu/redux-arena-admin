import { ARENABUILDING_USER_TOKEN_ERROR } from "../actionTypes";

function parseResponse(response, requestTime) {
  if (!response.ok) {
    if (response.status === 401) {
      console.warn("Identity check failed. May I confirm your identity again?");
      window.reduxStore.dispatch({ type: ARENABUILDING_USER_TOKEN_ERROR });
    }
    throw { httpStatusCode: response.status, response };
  } else {
    let ct = response.headers.get("content-type");
    let result = null;
    if (ct == null || ct.indexOf("application/json") < 0) {
      console.warn("content-type not contain application/json");
      return response.text();
    }
    return response.json();
  }
}

export function gGet(url) {
  let gHeaders = new Headers();
  let requestTime = new Date().getTime();
  gHeaders.append("Content-Type", "application/json;charset=utf-8");
  gHeaders.append("x-token", sessionStorage.getItem("X-Session-Token"));
  var getInit = {
    method: "GET",
    headers: gHeaders,
    mode: "cors",
    cache: "default"
  };
  return fetch(url, getInit).then(function(response) {
    return parseResponse(response, requestTime);
  });
}

export function gDel(url, body) {
  let gHeaders = new Headers();
  let requestTime = new Date().getTime();
  gHeaders.append("Content-Type", "application/json;charset=utf-8");
  gHeaders.append("x-token", sessionStorage.getItem("X-Session-Token"));
  var delInit = {
    method: "DELETE",
    headers: gHeaders,
    mode: "cors",
    body: body ? JSON.stringify(body) : null,
    cache: "default"
  };
  return fetch(url, delInit).then(function(response) {
    return parseResponse(response, requestTime);
  });
}

export function gPost(url, body) {
  let gHeaders = new Headers();
  let requestTime = new Date().getTime();
  gHeaders.append("Content-Type", "application/json;charset=utf-8");
  gHeaders.append("x-token", sessionStorage.getItem("X-Session-Token"));
  var postInit = {
    method: "POST",
    headers: gHeaders,
    mode: "cors",
    body: body ? JSON.stringify(body) : null,
    cache: "default"
  };
  return fetch(url, postInit).then(function(response) {
    return parseResponse(response, requestTime);
  });
}

export function gPut(url, body) {
  let gHeaders = new Headers();
  let requestTime = new Date().getTime();
  gHeaders.append("Content-Type", "application/json;charset=utf-8");
  gHeaders.append("x-token", sessionStorage.getItem("X-Session-Token"));
  var putInit = {
    method: "PUT",
    headers: gHeaders,
    mode: "cors",
    body: body ? JSON.stringify(body) : null,
    cache: "default"
  };
  return fetch(url, putInit).then(function(response) {
    return parseResponse(response, requestTime);
  });
}

export function gGetS(url) {
  let request = new XMLHttpRequest();
  let requestTime = new Date().getTime();
  request.open("GET", url, false);
  request.send(null);
  // if (request.status === 200) {     return (request.responseText); } else {
  // console.log('Network response was not ok.'); }
  return request.responseText;
}
