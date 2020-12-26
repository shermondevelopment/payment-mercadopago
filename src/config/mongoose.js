const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);


module.exports = mongoose;