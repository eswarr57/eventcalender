const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const Event = require('./models/event');
const File = require('./models/file');

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `./uploads/${req.body.eventId}`;
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Routes
app.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        const files = await File.find();
        res.render('index', { events, files });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching events/files");
    }
});

// Add Event
app.post('/add-event', async (req, res) => {
    try {
        const { title, description, date } = req.body;
        const newEvent = new Event({ title, description, date, attendees: 0 });
        await newEvent.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding event");
    }
});

// RSVP
app.post('/rsvp/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if(event){
            event.attendees = (event.attendees || 0) + 1;
            await event.save();
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error RSVPing");
    }
});

// Upload File
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const newFile = new File({
            originalName: req.file.originalname,
            serverName: req.file.filename,
            eventId: req.body.eventId,
            url: `/uploads/${req.body.eventId}/${req.file.filename}`
        });
        await newFile.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error uploading file");
    }
});

// MongoDB Atlas connection
mongoose.connect(
    'mongodb+srv://kaligatlaeswarr_db_user:libtLerqffadfH8l@cluster0.hn80p9n.mongodb.net/studentHub?retryWrites=true&w=majority&appName=Cluster0',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Start server on Render assigned port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
