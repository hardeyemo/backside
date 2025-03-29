const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const categoryRoute = require('./routes/categories');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

dotenv.config();

app.use(express.json());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use('/app/auth', authRoute);
app.use('/app/users', userRoute);
app.use('/app/posts', postRoute);
app.use('/app/categories', categoryRoute);
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: true,
})
    .then(() => console.log("DB Connected"))
    .catch((err) => console.error("DB Connection Error:", err));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    }
});
const upload = multer({ storage: storage });
app.post('/app/upload', upload.single('file'), (req, res) => {
    console.log("Uploaded File Name:", req.body.name);
    res.status(200).json('File has been uploaded');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(8800, () => {
    console.log('Backend is running on port 8800');
});
