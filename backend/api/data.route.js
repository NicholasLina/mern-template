import express from "express"
import DataCtrl from "./data.controller.js";

const router = express.Router()

router.route("/").get(DataCtrl.apiGetData);

router
    .route("/data")
    .post(DataCtrl.apiPostData)
    .put(DataCtrl.apiUpdateData)
    .delete(DataCtrl.apiDeleteData)

export default router