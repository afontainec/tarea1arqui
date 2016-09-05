//controllers/visitController


var path = require('path');
var Visits = require('../models/visits.js');





function addRequestParams(visit, req) {

    //add Browser

    visit.browser = getBrowser(req);

    //add ip

    console.log("User Agent: " + req.headers['user-agent']);
    visit.ip = req.connection.remoteAddress;

    //add os

    visit.os = getOS(req);
}

function getOS(req) {
    var userAgent = req.headers['user-agent'];

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    } else if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    // Mac detection
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/Mac/.test(userAgent)) {
        return "MacOS";
    }
    // CHEck if this is correct
    if (/Win/.test(userAgent)) {
        return "Windows";
    }

    if (/BlackBerry/.test(userAgent)) {
        return "BlackBerry";
    }

    if (/Linux/.test(userAgent)) {
        return "Linux";
    }

    return "Other";
}

function getBrowser(req) {
    var ua = req.headers['user-agent'],
        tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
}


function createVisitEntry(visit, req, res) {
    addRequestParams(visit, req);
    Visits.create(visit, function(err, response) {
        if (err) {
          res.render(path.join(__dirname, '../', 'views', 'error.ejs'), {
              message: "failed to register visit",
              error: err
          });
        }

        Visits.all(function(err, response) {
          if (err) {
            res.render(path.join(__dirname, '../', 'views', 'error.ejs'), {
                message: "failed to get all visits",
                error: err
            });
          }
            res.render(path.join(__dirname, '../', 'views', 'index.ejs'), {
                visits: response
            });
        });
    });
}



exports.newVisit = function(req, res) {
    visit = req.body;
    createVisitEntry(visit, req, res);
};
