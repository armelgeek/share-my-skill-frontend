export const API_ENDPOINTS = {
  endpoint: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
    version: "v1",
  },
  product: {
    base: "/api/v1/product",
    create: "/api/v1/product",
    list: (qs: string = "") => `/api/v1/product${qs ? `?${qs}` : ""}`,
    detail: (id: string) => `/api/v1/product/${id}`,
    update: (id: string) => `/api/v1/product/${id}`,
    delete: (id: string) => `/api/v1/product/${id}`
  },
  user: {
    base: "/api/v1/user",
    create: "/api/v1/user",
    list: (qs: string = "") => `/api/v1/user${qs ? `?${qs}` : ""}`,
    detail: (id: string) => `/api/v1/user/${id}`,
    update: (id: string) => `/api/v1/user/${id}`,
    delete: (id: string) => `/api/v1/user/${id}`
  }
};
