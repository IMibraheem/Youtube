import dotenv from "dotenv";
dotenv.config({ path: "./env" });
import { mongoDbConnection } from "./db/index.js";
import { app } from "./app.js";

const port = process.env.PORT;

mongoDbConnection()
    .then(() =>
        app.listen(port || 8000, () => {
            console.log(`Server is running at ${port}`);
        })
    )
    .catch((err) => console.log(`MongoDb connection Failed`, err));
