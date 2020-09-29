// Connection to MongoDB
import mongoose from "mongoose";

const { DB_CLUSTER, DB_DATABASE, DB_USER, DB_PASSWORD } = process.env

const connectDB = async () => {
    try {
        await mongoose
            .connect(
                `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}.jw1ce.mongodb.net/${DB_DATABASE}?retryWrites=true&w=majority`,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true
                },
            );
        console.log("Connection to MongoDB successful!");
    } catch (err) {
        console.log("Connection to MongoDB unsuccessful!");
        console.error(err.message);
        //Exit process if failure to connect to DB
        process.exit(1);
    }
}

module.exports = connectDB;
