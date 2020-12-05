const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
    let body;
    let path = req.url;
    if (path === "/") {
        path = '/index.html'
    }
    try {
        path = decodeURI(path);
    } catch (e) { // catches a malformed URI
        console.error(e);
    }
    try {
        body = fs.readFileSync('./public' + path);
        res.end(body);
    } catch (err) {
        res.statusCode = 404;
        res.end('File not found');
    }

})

const port = process.env.PORT || 3000

server.listen(port)

console.log(`Server started on port ${port}`)