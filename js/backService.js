import { environment } from "../config/environment.js";

const getDBToken = async (token) => {
  try{
    const response = await fetch(`${environment.backendURL}checkToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
      }),
    });
    console.log("result getDBToken",response);
    if(response.status >= 500){
      return 500;
    }
    else{
      return response.json();
    }
  }
  catch(error){
    console.log("error getDBToken",error);
    window.open(environment.webBaseURL,"_blank");
  }
};

const createVideo = async (dbToken, name, recordedDate) => {
  const response = await fetch(`${environment.backendURL}video`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${dbToken}`,
    },
    body: JSON.stringify({
      name: name,
      recordedDate: recordedDate,
    }),
  });
  return response.json();
};

const updateVideo = async (dbToken, duration, videoLink, id) => {
  const response = await fetch(`${environment.backendURL}video/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${dbToken}`,
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
    `${environment.backendURL}video/${idVideo}/tag/start`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${dbToken}`,
      },
      body: JSON.stringify({
        startTime: startTime,
      }),
    }
  );
  console.log(response)
  return response.json();
};

const tagEndTime = (dbToken, idVideo, idTag, endTime) => {
  fetch(
    `${environment.backendURL}video/${idVideo}/tag/${idTag}/end`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${dbToken}`,
      },
      body: JSON.stringify({
        endTime: endTime,
      }),
    }
  );
};

const addMark = async (dbToken, idVideo, time) => {
  const response = await fetch(
    `${environment.backendURL}video/${idVideo}/mark`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${dbToken}`,
      },
      body: JSON.stringify({
        time: time,
      }),
    }
  );
  return response.json();
};

const getAllVideos = async (dbToken) => {
  const response = await fetch(
    `${environment.backendURL}videos`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${dbToken}`,
      }
    }
  );
  return response.json();
};

export { getDBToken, createVideo, updateVideo, addTag, tagEndTime, addMark, getAllVideos };
