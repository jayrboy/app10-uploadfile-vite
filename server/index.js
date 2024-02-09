import express from 'express'
import fs from 'fs'
import formidable from 'formidable'
import cookieParser from 'cookie-parser'
import session from 'express-session'

const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cookieParser())

app.use(
  session({ secret: 'reactrestapi', resave: false, saveUninitialized: false })
)

app.get('/api/session/get', (req, res) => {
  // ตรวจสอบว่ามีข้อมูลจัดเก็บไว้ใน sessions หรือไม่
  let s = req.session.email ? true : false
  res.json({ signedIn: s })
})

app.post('/api/session/set', (req, res) => {
  // ถ้าส่งข้อมูลมาจาก form เข้ามา ตรวจสอบแค่ password
  // โดย password ถูกต้อง ก็ให้เก็บค่า email ไว้ใน session เพื่อตรวจสอบในภายหลัง
  // แล้วส่งค่ากลับไปว่าได้เข้าสู่ระบบแล้ว
  let email = req.body.email || ''
  let password = req.body.password || ''
  if (password === '1234') {
    req.session['email'] = email
    res.json({ signedIn: true })
  } else {
    res.json({ signedIn: false })
  }
})

// สำหรับการลบข้อมูลใน session เพื่อออกจากระบบ
app.get('/api/session/delete', (req, res) => {
  req.session.destroy((err) => {
    res.json({ signedIn: false })
  })
})

app.get('/api/cookie/get', (req, res) => {
  let e = req.cookies['email'] || ''
  let p = req.cookies['password'] || ''
  let s = req.cookies['save'] ? true : false
  res.json({ email: e, password: p, save: s })
})

app.post('/api/cookie/set', (req, res) => {
  let email = req.body.email || ''
  let password = req.body.password || ''

  //TODO:
  if (req.body.save) {
    let age = 10 * 1000 // 10 second
    res.cookie('email', email, { maxAge: age })
    res.cookie('password', password, { maxAge: age })
    let save = req.body.save
    res.cookie('save', save, { maxAge: age })
    res.send('จัดเก็บข้อมูลไว้ในคุกกี้แล้ว')

    // ถ้าไม่ได้เลือกบันทึกข้อมูล แต่อาจมีข้อมูลเดิมเก็บเอาไว้
    // ดังนั้น เราอาจลบข้อมูลเหล่านั้นออกไป (ถึงไม่มีก็ไม่เกิด Error)
  } else {
    res.clearCookie('email')
    res.clearCookie('password')
    res.clearCookie('save')
    res.send('ข้อมูล *ไม่ได้* ถูกจัดเก็บในคุกกี้')
  }
})

app.post('/api/upload', (req, res) => {
  let form = formidable({})
  form.parse(req, (err, fields, files) => {
    if (files.image[0].size === 0) {
      res.json({ imgSrc: '', desrc: 'No File' })
      return
    }
    let upfile = files.image[0]
    let fileName = upfile.originalFilename.split('.')

    let r1 = Math.floor(Math.random() * 99999)
    let r2 = Math.floor(Math.random() * 99999)

    fileName[0] = r1 + '-' + r2 // edit a filename 12345-67890
    // fileName = ['12345-67890','jpg']

    let newName = fileName.join('.')
    let target = 'public/images/' + newName

    fs.rename(upfile.filepath, target, (e) => {
      res.json({ imgSrc: `images/${newName}`, desrc: fields.description[0] })
    })
  })
})

app.listen(8000, () => console.log('http://localhost:8000'))
