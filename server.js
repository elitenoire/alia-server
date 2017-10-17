const jsonServer = require('json-server');
//Create express server
const server = jsonServer.create();
//JSON server router
const router = jsonServer.router('db.json');
//Use default options for middlewares
const middlewares = jsonServer.defaults();
const port = process.env.PORT // || 3003;

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        let title = req.body.title
        let categories = req.body.categories
        let content = req.body.content
        if(title && categories && content && (
            title !== '' && categories !== '' && content !== ''
        )){
            req.body.timeStamp = Date.now()
        }
        else {
            return res.status(400).end('Missing a snap field')
        }

    }
    // Continue to JSON Server router
    next()
})

router.render = (req, res) => {
    if(Object.keys(res.locals.data).length == 0){
        res.jsonp({
          error: "404 error not found"
        })
    }
    else res.jsonp(res.locals.data)
  }

//Use default router - in-memory database
// server.use(router);
server.use('/api', router)
//start server
server.listen(port);