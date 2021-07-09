const serviceAccount = require('./private/private.json');
const admin = require('firebase-admin');
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const { generate } = require('./generate-report.js');
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

server.get('/generate-report', (req, res) => {
  generate().then(result => {
    res.jsonp(result);
  });
})

server.get('/report', (req, res) => {
  let rawdata;
  try {
    rawdata = fs.readFileSync('report.json');
  } catch (e) {
    res.jsonp({});
    return;
  }

  res.jsonp(JSON.parse(rawdata));
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()

    const docRef = db.collection('temp').doc(Date.now());
    await docRef.set(req.body);
  }
  // Continue to JSON Server router
  next()
})

// Use default router
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})