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

const updateVideo = async (dbToken, duration, videoLink, id) => {
  const response = await fetch(environment.backendURL + "video/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + dbToken,
    },
    body: JSON.stringify({
      duration: duration,
      videoLink: videoLink,
    }),
  });
  return response.json();
};

const addTag = async (dbToken, idVideo, startTime) => {
  const response = await fetch(
    environment.backendURL + "video/" + idVideo + "/tag/start",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + dbToken,
      },
      body: JSON.stringify({
        startTime: startTime,
      }),
    }
  );
  return response.json();
};

const tagEndTime = async (dbToken, idVideo, idTag, endTime) => {
  const response = await fetch(
    environment.backendURL + "video/" + idVideo + "/tag/" + idTag + "/end",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + dbToken,
      },
      body: JSON.stringify({
        endTime: endTime,
      }),
    }
  );
  return response.json();
};

const addMark = async (dbToken, idVideo, time) => {
  const response = await fetch(
    environment.backendURL + "video/" + idVideo + "/mark",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + dbToken,
      },
      body: JSON.stringify({
        time: time,
      }),
    }
  );
  return response.json();
};

export { getDBToken, createVideo, updateVideo, addTag, tagEndTime, addMark };
