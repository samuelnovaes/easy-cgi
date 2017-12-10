# Easily create a CGI server

[![NPM](https://nodei.co/npm/easy-cgi.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/easy-cgi/)

# Installation

- Install [Node.js](https://nodejs.org)
- Install easy-cgi

```
npm install -g easy-cgi
```

# Example (Using Bash)

Create a directory for your app whith your CGI executable files.

App directory

```
app
└---hello.sh
```

app/hello.sh

```bash
#!/bin/sh

# Headers are written first. The special "Status"
# header indicates the response status code
echo "Status: 200"
echo "Content-Type: text/plain"
echo

# Followed by a response body
echo "Hello World!"
```


Give execute permissions to the file
```bash
chmod +x hello.sh
```

Then start your CGI server

```bash
cgi
```


Access the address http://localhost:8080/hello in the browser

# Routing

The routes are created automatically by file name

Example:

- For the `app/hello.sh` file, the route is `/hello`
- For the `app/foo/bar.sh` file, the route is `/foo/bar`
- For the `app/index.sh` file, the route is `/`
- For the `app/foo/index.sh` file, the route is `/foo`

> If you create a `app/src` directory, it will be ignored

### Dynamic routes

Dynamic routes are created adding underscore in file name or directory

Example:

- For the `app/users/_id.sh` file, the route is `/users/<id>`
- For the `app/_foo/bar.sh` file, the route is `/<foo>/bar`

# Get request values

You can access the request values ​​through the REQUEST environment variable in JSON format

The REQUEST environment variable looks like

```json
{
	"body": {},
	"params": {},
	"query": {},
	"headers": {},
	"files": {}
}
```

> No sessions are supported yet

# Static files

To serve static files, create a `static` directory
