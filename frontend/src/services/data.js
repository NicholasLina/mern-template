import http from "../http-common";

class DataService {
    getAll(page = 0) {
        return http.get(`data?page=${page}`);
    }

    get(id) {
        return http.get(`/data?id=${id}`);
    }

    find(query, by = "name", page = 0) {
        return http.get(`data?${by}=${query}&page=${page}`);
    } 

    createReview(data) {
        return http.post("/data", data);
    }

    updateReview(data) {
        return http.put("/data", data);
    }

    deleteReview(id) {
        return http.delete(`/data?id=${id}`);
    }

    getCategories(id) {
        return http.get(`/categories`);
    }
}