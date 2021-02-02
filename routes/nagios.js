"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const readline = require("readline");
const fs = require("fs");
class nagios {
    constructor(statusPath) {
        this.debug = Debug('nagios');
        this.debugParse = Debug('nagios:parse');
        this.statusPath = statusPath;
        this.parserSectionsAccepted = [
            'hoststatus',
            'servicestatus',
        ];
        this.parserFieldsAccepted = [
            'host_name',
            'service_description',
            'current_state',
            'plugin_output',
            'last_state_change'
        ];
        this.parserInSection = false;
        this.hosts = [];
        this.hostStats = { count: 0, failing: 0 };
        this.services = [];
        this.serviceStats = { count: 0, failing: 0 };
        fs.watchFile(this.statusPath, { interval: 10000 }, () => {
            this.debug(this.statusPath, 'changed, refreshing data');
            this.readData();
        });
    }
    getStats() {
        return { hosts: this.hostStats, services: this.serviceStats };
    }
    getHosts() {
        return this.hosts;
    }
    getHostsFailing() {
        let hostsFailing = [];
        this.hosts.forEach((i) => {
            if (i.current_state != 0) {
                hostsFailing.push(i);
            }
        });
        return hostsFailing;
    }
    getServices() {
        return this.services;
    }
    getServicesFailing() {
        let servicesFailing = [];
        this.services.forEach((i) => {
            if (i.current_state != 0) {
                servicesFailing.push(i);
            }
        });
        return servicesFailing;
    }
    readData() {
        this.debug('Clearing hosts and services');
        this.hosts = [];
        this.services = [];
        this.hostStats = { count: 0, failing: 0 };
        this.serviceStats = { count: 0, failing: 0 };
        this.debug('Starting parsing:', this.statusPath);
        this.lineReader = readline.createInterface({
            input: fs.createReadStream(this.statusPath)
        });
        this.lineReader.on('line', (line) => { this.parseLine(line); });
        this.lineReader.on('close', () => { this.readDataDone(); });
    }
    readDataDone() {
        this.debug('Host stats:', this.hostStats);
        this.debug('Service stats:', this.serviceStats);
        this.lineReader.close();
        this.lineReader = null;
    }
    getSectionObj(currentType) {
        switch (currentType) {
            case "hoststatus":
                return { obj: this.hosts, stats: this.hostStats };
            case 'servicestatus':
                return { obj: this.services, stats: this.serviceStats };
            default:
                this.debugParse('Failed to return object for:', currentType);
        }
    }
    parseLine(line) {
        let l = line.trim();
        if (l.length == 0 || l.charAt(0) == '#') {
            return;
        }
        if (l.substr(l.length - 1) == '{') {
            let section = l.split(' ')[0];
            if (this.parserSectionsAccepted.indexOf(section) >= 0) {
                this.parserInSection = true;
                this.parserSectionType = section;
                this.debugParse('Section accepted:', section);
                this.getSectionObj(this.parserSectionType).obj.push({});
                return;
            }
            return;
        }
        else if (!this.parserInSection) {
            return;
        }
        if (this.parserInSection && l.charAt(0) == '}') {
            this.parserInSection = false;
            this.debugParse('Section ended:', this.parserSectionType);
            return;
        }
        let fieldName = l.substr(0, l.indexOf('='));
        let fieldValue = l.substr(l.indexOf('=') + 1);
        if (this.parserInSection && this.parserFieldsAccepted.indexOf(fieldName) >= 0) {
            this.debugParse('Field accepted:', fieldName);
            this.getSectionObj(this.parserSectionType).obj
                .slice(-1).pop()[fieldName] = fieldValue;
            if (fieldName == "current_state") {
                this.getSectionObj(this.parserSectionType).stats.count++;
                if (parseInt(fieldValue) != 0) {
                    this.getSectionObj(this.parserSectionType).stats.failing++;
                }
            }
            return;
        }
        else {
            return;
        }
    }
}
exports.nagios = nagios;



