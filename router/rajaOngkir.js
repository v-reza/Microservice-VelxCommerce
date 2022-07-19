const router = require('express').Router()
const dotenv = require("dotenv")
dotenv.config()

const { init } = require('rajaongkir-node-js')
const request = init(process.env.RAJA_ONGKIR_KEY, 'starter')


router.get("/provinsi", async (req, res) => {
    try {
        const province = await request.get("/province")
        const response = await JSON.parse(province);
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/kota", async (req, res) => {
    try {
        const kota = await request.get("/city")
        const response = await JSON.parse(kota)
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/kota/:provinsiId", async (req, res) => {
    try {
        const kota = await request.get("/city?province=" + req.params.provinsiId)
        const response = await JSON.parse(kota)
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.post("/ongkir", async (req, res) => {
    try {
        const ongkir = await request.post('/cost', req.body)
        const response = await JSON.parse(ongkir)
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.post("/ongkir/:costIndex", async (req, res) => {
    try {
        const ongkir = await request.post("/cost", req.body)
        const response = await JSON.parse(ongkir)
        const costIndex =  await response.rajaongkir.results[0].costs[req.params.costIndex - 1]
        if (!costIndex) {
            return res.status(404).json("cost not found")
        }
        res.status(200).json(costIndex)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router