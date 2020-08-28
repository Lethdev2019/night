require("sqreen")
const express = require('express');
const config = require('./config.js');
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const app = express();


app.enable("trust proxy");
 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
});
 
//  apply to all requests
app.use(limiter);

app.use('/', express.static('./public'));

for (let page of config.pages) {
	let root = './views/';
	if (fs.existsSync(`./pages/custom/${page}.html`)) {
		root = './views/custom/';
	}
	if (page == 'home') {
		app.get('/', async (req, res, next) => await res.sendFile(`${page}.html`, { root: root }));
	} else {
		app.get(`/${page}`, async (req, res, next) => await res.sendFile(`${page}.html`, { root: root }));
	}
}


const port = process.env.PORT || config.port;
app.listen(port, () => {
  console.log('Express server listening on port', port)
});
