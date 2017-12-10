#!/usr/bin/env node
let express = require('express')
let cors = require('cors')
let bodyParser = require('body-parser')
let multipart = require('connect-multiparty')
let compression = require('compression')
let serveStatic = require('serve-static')
let cgi = require('cgi')
let path = require('path')
let walk = require('walk')
let fs = require('fs')
let get_ip = require('ipware')().get_ip
let app = express()
let dir = process.cwd()
let walker = walk.walk(dir)
let staticDir = path.join(dir, 'static')
let port = process.env.PORT || 8080

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(multipart())
app.use(compression())

fs.access(staticDir, fs.constants.R_OK, err => {
	if(!err){
		app.use(serveStatic(staticDir))
	}
})

console.log('Creating routes')
console.log()

walker.on('file', (root, file, next) => {
	if(root != path.join(dir, 'src') && root != staticDir){
		let filename = path.parse(file.name).name
		let route = `${root.replace(new RegExp(`^${dir}`), '')}/${filename == 'index' ? '' : filename}`
		route = route.replace(/_/g, ':')
		console.log(route)
		app.all(route, (req, res, next) => {
			console.log(req.method, req.path, `from ${get_ip(req).clientIp}`)
			process.env.REQUEST = JSON.stringify({
				body: req.body,
				params: req.params,
				query: req.query,
				headers: req.headers,
				files: req.files
			})
			next()
		}, cgi(`${root}/${file.name}`))
	}
	next()
})

walker.on('end', () => {
	app.listen(port, () => {
		console.log()
		console.log(`Server running on port ${port}`)
		console.log()
	})
})
