import { environment } from "../config/environment.js";

const getDBToken = async (token) => {
  const response = await fetch(environment.backendURL + "checkToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
    }),
  });
  return response.json();
};
const setDBToken = () => {
  chrome.storage.local.get("dbToken", async (result) => {
    if (result.length == undefined) {
      //redirect to web to auth
      window.open(environment.webBaseURL, "_blank");
    } else {
      //verify if token is expired
      let token = await getDBToken(result);
      if (!token) {
        window.open(environment.webBaseURL, "_blank");
      } else {
        //save token to comunicate woith back
        window.dbToken = token;
        chrome.storage.local.set({ dbToken: token }, () => {});
      }
    }
  });
};

const createVideo = async (dbToken, name, recordedDate) => {
  const response = await fetch(environment.backendURL + "video", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + dbToken,
    },
    body: JSON.stringify({
      name: name,
      recordedDate: recordedDate,
    }),
  });
  return response.json();
};

const updateVideo = async (dbToken, duration, id) => {
  const response = await fetch(environment.backendURL + "video/" + id, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + dbToken,
    },
    body: JSON.stringify({
      duration: duration,
    }),
  });
  return response.json();
};


export { getDBToken, setDBToken, createVideo, updateVideo };
