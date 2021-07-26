require("dotenv").config({ path: ".env" });

module.exports = {
  mongodb: {
    Uri: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.mr9o4.mongodb.net:27017,cluster0-shard-00-01.mr9o4.mongodb.net:27017,cluster0-shard-00-02.mr9o4.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-11i50l-shard-0&authSource=admin&retryWrites=true&w=majority`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
  },
  secret: process.env.JWT_SECRET,
};
