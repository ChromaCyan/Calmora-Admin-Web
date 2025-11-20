import simpleRestProvider from "ra-data-simple-rest";

// Replace with your own api or use my own and add the local url here
const API_URL = "https://calmora-api.vercel.app/api";

// Attach JWT to every request
const fetchJsonWithAuth = async (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }

  const token = localStorage.getItem("authToken");
  if (token) {
    options.headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, options);
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.statusText);
  }
  return response.json();
};

const baseProvider = simpleRestProvider(API_URL, fetchJsonWithAuth);

// Helper to normalize `_id` to `id`
const mapId = (data) => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map((item) => ({
      ...item,
      id: item._id || item.id,
    }));
  }
  return { ...data, id: data._id || data.id };
};

const dataProvider = {
  ...baseProvider,

  getList: async (resource, params) => {
    const res = await baseProvider.getList(resource, params);
    return { ...res, data: mapId(res.data) };
  },

  getOne: async (resource, params) => {
    const res = await baseProvider.getOne(resource, params);
    return { ...res, data: mapId(res.data) };
  },

  getMany: async (resource, params) => {
    const res = await baseProvider.getMany(resource, params);
    return { ...res, data: mapId(res.data) };
  },

  update: async (resource, params) => {
    const res = await baseProvider.update(resource, params);
    return { ...res, data: mapId(res.data) };
  },

  create: async (resource, params) => {
    const res = await baseProvider.create(resource, params);
    return { ...res, data: mapId(res.data) };
  },
};

export default dataProvider;
