"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nagios_1 = require("./nagios");
class nnrs {
    constructor(statusPath) {
        this.express = express();
        this.middleware();
        this.routes();
        this.nagios = new nagios_1.nagios(statusPath);
        this.nagios.readData();
    }
    middleware() {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cors());
    }
    routes() {
        let router = express.Router();
        const { demo } =require("./demos")
        router.get('/stats', (req, res, next) => {
            res.json(this.nagios.getStats());
        });
        router.get('/hosts', (req, res, next) => {
            res.json(this.nagios.getHosts());
        });
        router.get('/hosts/failing', (req, res, next) => {
            res.json(this.nagios.getHostsFailing());
            
        });
        router.get('/services', (req, res, next) => {
            res.json(this.nagios.getServices());
        });
        router.get('/services/failing', (req, res, next) => {
            res.json(this.nagios.getServicesFailing());
        });
        router.get('/matty', demo)
        this.express.use('/', router);
    }
}
exports.nnrs = nnrs;
