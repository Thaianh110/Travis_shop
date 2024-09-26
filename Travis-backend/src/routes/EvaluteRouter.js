const express = require("express");
const router = express.Router();
const EvaluteController= require("../controllers/EvaluteController")

router.post('/create-evalute',EvaluteController.createEvalute);
router.get('/get-details/:id',EvaluteController.getDetailsEvalute)
router.get('/get-all',EvaluteController.getAllEvalute)
module.exports = router