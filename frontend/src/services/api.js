import axios from "axios";

const api = axios.create({ baseURL: "http://localhost" });
// const api = axios.create({ baseURL: "http://192.168.1.55/" });

// Fetch event logs with search filters
export const getEvents = (
  query = "",
  start_time = null,
  end_time = null
) => {
  const params = new URLSearchParams();
  if (query) params.append("query", query);
  if (start_time) params.append("start_time", start_time);
  if (end_time) params.append("end_time", end_time);
  return api.get(`/api/search/?${params.toString()}`);
};
// api/search/?query=