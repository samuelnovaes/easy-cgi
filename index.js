#!/usr/bin/env node
let express = require('express')
let cors = require('cors')
let bodyParser = require('body-parser')
let multipart = require('connect-multiparty')
let compression = require('compression')
let cgi = require('cgi')
let path = require('path')
let walk = require('walk')
let app = express()
let walker = walk.walk(process.cwd())
let port = process.env.PORT || 8080

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(multipart())
app.use(compression())

walker.on('file', (root, file, next) => {
	if(root != path.join(process.cwd(), 'src')){
		let route = `${root.replace(new RegExp(`^${process.cwd()}`), '')}/${path.parse(file.name).name}`
		route = route.replace(/_/g, ':')
		app.all(route, setEnv, cgi(`${root}/${file.name}`))
		if(route == '/index'){
			app.all('/', setEnv, cgi(`${root}/${file.name}`))
		}
	}
	next()
})

walker.on('end', () => {
	app.listen(port, () => {
		console.log(`Server running on port ${port}`)
	})
})

function setEnv(req, res, next){
	process.env.REQUEST = JSON.stringify({
		body: req.body,
		params: req.params,
		query: req.query,
		headers: req.headers,
		files: req.files
	})
	next()
}
