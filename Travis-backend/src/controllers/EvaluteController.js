const EvaluteService = require("../services/EvaluteService")

const createEvalute = (async (req, res) => {
  try {
    const { user, rating, comment, product } = req.body

    if (!user || !rating || !comment || !product) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required"
      })
    }
    const response = await EvaluteService.createEvalute(req.body);
    return res.status(200).json(response)
  } catch (e) {
    return res.status(400).json({
      message: e
    })
  }

})
const getAllEvalute = (async (req, res) => {
  try {
    const response = await EvaluteService.getAllEvalute();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
})

const getDetailsEvalute = (async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERROR",
        message: "The productId is required",
      });
    }
    const response = await EvaluteService.getDetailsEvalute(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
})

module.exports = {
  createEvalute,
  getAllEvalute,
  getDetailsEvalute
}
