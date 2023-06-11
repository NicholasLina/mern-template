import app from "./server.js";
import mongodb from "mongodb";
import dontenv from "dotenv";
import DataDAO from "./dao/dataDAO.js";
dontenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

MongoClient.connect(                // connect to db
    process.env.DB_URI,
    {
        wtimeoutMS: 2500
    }
)
.catch( err => {
    console.log(err.stack)
    process.exit(1)
})
.then(async client => {
    await DataDAO.injectDB(client)  // pass db.collection to database
    app.listen(port, () => {        // start backend
        console.log("listening on port " + port)
    })
});