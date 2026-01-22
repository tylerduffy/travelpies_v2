const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const bodyParser = require('body-parser');

const destinationImages = {
    "Carmel": "carmel_in.jpg",
    "Chicago": "chicago_bean.jpg",
    "Cincinnati": "cincinnati_baseball_stadium.jpg",
    "Dallas": "dallas_cityscape_night.jpg",
    "Denver": "denver_mountain_cityscape.jpg",
    "Gold_Coast": "goldcoast_beach.jpg",
    "Indiana": "flag_of_indiana.jpg",
    "Indianapolis": "indianapolis_in.jpg",
    "Las_Vegas": "lasvegas_strip.jpg",
    "Keyonna_Beach": "keyonnabeach_antigua.jpg",
    "London": "london_eye.jpg",
    "Los_Angeles": "losangeles_ca.jpg",
    "Louisville": "louisville_downtown.jpg",
    "Nashville": "nashville_broadway_st.jpg",
    "New_Buffalo": "newbuffalo_straydog.jpg",
    "New_York_City": "newyorkcity_statueofliberty.jpg",
    "Paris": "paris_eiffeltower.jpg",
    "Plymouth": "plymouth_clocktower.jpg",
    "San_Francisco": "sanfrancisco_ca.jpg",
    "Santa_Rosa": "30A_beach_access.jpg",
    "Santorini": "santorini_wateroverlook.jpg",
    "Terre_Haute": "terrehaute_rosehulman_chapel.jpg",
    "Toronto": "toronto_skyline.jpg",
    "Venice": "venice_grandcanal.jpg",
    "Westfield": "westfield_in.jpg",
    "Zionsville": "zionsville_in.jpg"
}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended : true }));

app.use('/styles', express.static(__dirname + '/public/styles'));
app.use('/scripts', express.static(__dirname + '/public/scripts'));
app.use('/img', express.static(__dirname + '/public/img'));

// routes
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/views"));

app.get('/distance', (req, res) => {
    let destination_raw = req.query.destination
    let destination_display = destination_raw.replace("_", " ");

    const data = {
        destination_raw: req.query.destination,
        destination_display: destination_display
    }
    res.render('distance', data);
});

app.get('/pie', (req, res) => {
    let destination_raw = req.query.destination
    let destination_display = destination_raw.replace("_", " ");

    const data = {
        destination_raw: destination_raw,
        destination_display: destination_display,
        distance: parseInt(req.query.distance),
        background: destinationImages[destination_raw]
    }
    res.render('pie', data);
});

var server = app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
});