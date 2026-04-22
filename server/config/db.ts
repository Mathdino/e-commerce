import mongoose from "mongoose";

const conectDB = async () => {
  mongoose.connection.on("conectado", () => {
    console.log("MongoDB conectado");
  });
  await mongoose.connect(process.env.MONGODB_URL as string);
};

export default conectDB;
