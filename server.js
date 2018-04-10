const jsonServer = require('json-server');
const fs = require('fs');
fs.createReadStream('db.example.json').pipe(fs.createWriteStream('db.json'));

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
    res.jsonp(req.query)
});
// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

function pad02(input) {
    return input.toString().padStart(2, '0');
}

function getFormattedDateNow() {
    const date = new Date();
    return date.getFullYear() + "-" + pad02(date.getMonth() + 1) + "-" + pad02(date.getDate()) + " " + pad02(date.getHours()) + ":" + pad02(date.getMinutes()) + ":" + pad02(date.getSeconds());
}

let rid = 0;
server.use((req, res, next) => {
    if (req.method === 'POST') {
        req.body.time = req.body.time ? req.body.time : getFormattedDateNow();
        if (req.originalUrl === '/attendances') {
            rid++;
            req.body.rid = rid;
            req.body.fk_user = ~~req.body.fk_user;
            req.body.direct = ~~req.body.direct;
            req.body.type = ~~req.body.type;
        }
    }
    // Continue to JSON Server router
    next()
});

// Use default router
server.use(router);
server.listen(process.env.PORT || 5000, () => {
    console.log('JSON Server is running')
});
