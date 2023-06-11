import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;


let data;

export default class DataDAO {
    // create connection to database
    static async injectDB(conn) {
      if (data) {
          return
      }
      try {
          data = await conn.db(process.env.DATA_NS).collection("collection")
      } catch (e) {
          console.error(
          `Unable to establish a collection handle in dataDAO: ${e}`,
          )
      }
    }

  static async getData({
    filters = null,
    page = 0,
    dataPerPage = 20,
  } = {}) {
    let query

    if (filters) {
      if ("search" in filters) {
        query = { $text: { $search: filters["search"] } }
      } else if ("name" in filters) {
        query = { "name": { $eq: filters["name"] } }
      }
    }

    let cursor
    
    try {
      cursor = await data
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { dataList: [], totalNumData: 0 }
    }

    const displayCursor = cursor.limit(dataPerPage).skip(dataPerPage * page)

    try {
      const dataList = await displayCursor.toArray()
      const totalNumData = await data.countDocuments(query)

      return { dataList, totalNumData }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { dataList: [], totalNumData: 0 }
    }
  }

  static async getDataByID(id) {
    try {
      // this "pipeline" helps match documents from different collections, and turn the documents into aggregated results
      const pipeline = [
        {
            $match: {
                _id: new ObjectId(id),
            },
        },
              {
                  $lookup: {
                      from: "reviews",
                      let: {
                          id: "$_id",
                      },
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $eq: ["$restaurant_id", "$$id"],
                                  },
                              },
                          },
                          {
                              $sort: {
                                  date: -1,
                              },
                          },
                      ],
                      as: "reviews",
                  },
              },
              {
                  $addFields: {
                      reviews: "$reviews",
                  },
              },
          ]
      return await data.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getDataByID: ${e}`)
      throw e
    }
  }

  static async getCategories() {
    let categories = []
    try {
      categories = await data.distinct("category")
      return categories
    } catch (e) {
      console.error(`Unable to get categories, ${e}`)
      return categories
    }
  }

  static async addData(field, date) {
    try {
      const dataDoc = { 
          field: field,
          date: date,
      }

      return await data.insertOne(dataDoc)
    } catch (e) {
      console.error(`Unable to post data: ${e}`)
      return { error: e }
    }
  }

  static async updateData(dataId, field, date) {
    try {
      const updateResponse = await data.updateOne(
        { _id: new ObjectId(dataId)},
        { $set: { field: field, date: date  } },
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update data: ${e}` + "\n" + dataId)
      return { error: e }
    }
  }

  static async deleteData(dataId) {
    try {
      const deleteResponse = await data.deleteOne({
        _id: new ObjectId(dataId)
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete data: ${e}`)
      return { error: e }
    }
  }
}


