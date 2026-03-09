const express=require('express');
const app=express();
const dotenv=require('dotenv');
const routes=require('./routes/index');
const connectDB=require("./config/db");
const cors=require("cors");
dotenv.config();

const port=process.env.PORT || 5000;
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api',routes);
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`);
    });
});