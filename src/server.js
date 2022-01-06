const express = require('express');
const app = express()
const PORT = process.env.PORT || 3000
const path = require('path')
const ejs = require('ejs')
const os = require('os')
const api = os.networkInterfaces()[Object.keys(os.networkInterfaces())[0]][1].address 

app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.use(express.static( path.join(__dirname, 'public')))
app.set('views',  path.join(__dirname, 'views'))
app.use('/img', express.static( path.join(__dirname, 'img')))
app.use('/fonts', express.static( path.join(__dirname, 'fonts')))


app.get('/', (req, res) => res.render('index'))
app.get('/login', (req, res) => res.render('login'))
app.get('/register', (req, res) => res.render('register'))
app.get('/admin', (req, res) => res.render('admin'))
app.get('/img', (req, res) => res.sendFile('file'))
app.get('/fonts', (req, res) => res.sendFile('font'))


app.listen(PORT, () => console.log(`Client server is running on http://${api}:${PORT}`))