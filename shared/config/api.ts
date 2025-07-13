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
  },
  atelier: {
    base: "/api/v1/atelier",
    create: "/api/v1/atelier",
    list: (qs: string = "") => `/api/v1/atelier${qs ? `?${qs}` : ""}`,
    detail: (id: string) => `/api/v1/atelier/${id}`,
    update: (id: string) => `/api/v1/atelier/${id}`,
    delete: (id: string) => `/api/v1/atelier/${id}`
  },
  groupe: {
    base: "/api/v1/groupe",
    create: "/api/v1/groupe",
    list: (qs: string = "") => `/api/v1/groupe${qs ? `?${qs}` : ""}`,
    detail: (id: string) => `/api/v1/groupe/${id}`,
    update: (id: string) => `/api/v1/groupe/${id}`,
    delete: (id: string) => `/api/v1/groupe/${id}`
  },
  message: {
    base: "/api/v1/message",
    create: "/api/v1/message",
    list: (qs: string = "") => `/api/v1/message${qs ? `?${qs}` : ""}`,
    detail: (id: string) => `/api/v1/message/${id}`,
    update: (id: string) => `/api/v1/message/${id}`,
    delete: (id: string) => `/api/v1/message/${id}`
  },
  ressource: {
    base: "/api/v1/ressource",
    create: "/api/v1/ressource",
    list: (qs: string = "") => `/api/v1/ressource${qs ? `?${qs}` : ""}`,
    detail: (id: string) => `/api/v1/ressource/${id}`,
    update: (id: string) => `/api/v1/ressource/${id}`,
    delete: (id: string) => `/api/v1/ressource/${id}`
  },
  badge: {
    base: "/api/v1/badge",
    create: "/api/v1/badge",
    list: (qs: string = "") => `/api/v1/badge${qs ? `?${qs}` : ""}`,
    detail: (id: string) => `/api/v1/badge/${id}`,
    update: (id: string) => `/api/v1/badge/${id}`,
    delete: (id: string) => `/api/v1/badge/${id}`
  }
  ,
  commentaire: {
    base: "/api/v1/commentaire",
    create: "/api/v1/commentaire",
    list: (qs: string = "") => `/api/v1/commentaire${qs ? `?${qs}` : ""}`,
    detail: (id: string) => `/api/v1/commentaire/${id}`,
    update: (id: string) => `/api/v1/commentaire/${id}`,
    delete: (id: string) => `/api/v1/commentaire/${id}`
  }
};
