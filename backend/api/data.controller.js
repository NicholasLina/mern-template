import DataDAO from "../dao/dataDAO.js"

export default class DataController {
  static async apiGetData(req, res, next) {
    // get params from URL
    const dataPerPage = req.query.dataPerPage ? parseInt(req.query.dataPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.name) {
      filters.name = req.query.name
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode
    } else if (req.query.name) {
      filters.name = req.query.name
    }

    // get data from Data Access Object
    const { dataList, totalNumData } = await DataDAO.getData({
      filters,
      page,
      dataPerPage,
    })

    let response = {
      data : dataList,
      page : page,
      filters : filters,
      entries_per_page : dataPerPage,
      total_results : totalNumData,
    }
    res.json(response)
  }
  static async apiGetDataById(req, res, next) {
    try {
      let id = req.params.id || {}
      let data = await DataDAO.getDataByID(id)
      if (!data) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(data)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetDataCategories(req, res, next) {
    try {
      let cuisines = await DataDAO.getCategories()
      res.json(categories)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiPostData(req, res, next) {
    try {
      const field = req.body.field
      const date = new Date()

      const dataResponse = await DataDAO.addData(
        field,
        date
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateData(req, res, next) {
    try {
      const dataId = req.body.id
      const field = req.body.field
      const date = new Date()

      const dataResponse = await DataDAO.updateData(
        dataId,
        field,
        date
      )

      var { error } = dataResponse
      if (error) {
        res.status(400).json({ error })
      }

      if (dataResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update data - user may not match",
        )
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteData(req, res, next) {
    try {
      const dataId = req.body.id
      const dataResponse = await DataDAO.deleteData(
        dataId
      )
      if( dataResponse.deletedCount == 0 ) {
        console.log("No data found with id: " + dataId)
      }
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}