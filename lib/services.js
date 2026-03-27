import API from "./api";

// USERS
export const createUser = (data) => API.post("/users/google-login", data);
export const getUsers = () => API.get("/users/all");

// PLANS
export const getPlans = () => API.get("/plans/all");

// QUERIES
export const createQuery = (data) => API.post("/queries/add", data);
export const getQueries = () => API.get("/queries/all");

// OFFERS
export const getOffers = () => API.get("/offers/all");

// EXPENSES
export const getExpenses = () => API.get("/expenses/all");