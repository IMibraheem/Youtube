import dotenv from "dotenv";
import { mongoDbConnection } from "./db/index.js";
import { app } from "./app.js";
dotenv.config({ path: "./env" });

const port = process.env.PORT;

mongoDbConnection()
    .then(() =>
        app.listen(port || 8000, () => {
            console.log(`Server is running at ${port}`);
        })
    )
    .catch((err) => console.log(`MongoDb connection Failed`, err));
