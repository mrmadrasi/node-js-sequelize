const dotenv = require("dotenv");
dotenv.config();
/*require('./db/conn')*/
const express = require("express");
const cors = require("cors")
const app = express();
const PORT = process.env.PORT || 3000;
const masterData = require('./routes/auth.route');
const db = require('./models/index'); // Ensure this path is correct

app.use(express.json())
app.use(cors());
app.use("/api", masterData)

const jwtSecret = process.env.JWT_SECRET;
console.log("jwtSecret",jwtSecret)

db.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});