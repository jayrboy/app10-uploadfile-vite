#### Upload files

# วิธีการฝั่ง local

1. ภานใน form ต้องมีอินพุตชนิด file
2. เมื่อเราจะส่งข้อมูลจาก form ออกไป ก็อ่านค่าจาก input แต่ละอันด้วย new FormData(form.current)
3. กำหนดให้แก่ออบชัน body ของฟังกชัน fetch() ใน onSubmitForm function (ไม่ต้องแปลงเป็น JSON ทาง server จะเปลี่ยนวิธีการอ่านข้อมูลใหม่)

- <form ref={form} onSubmit={onSubmitForm} encType="multipart/form-data">
- <input type="file" name="image" accept="image/*" ref={file} />
- <textarea name="description" cols="30" rows="3"></textarea>
- <button>ส่งข้อมูล</button>

```js
import { useState, useRef } from 'react'

function App() {
  const [imgSrc, setImgSrc] = useState('')
  const [desrc, setDesrc] = useState('')
  const form = useRef()
  const file = useRef()

  const onSubmitForm = (e) => {
    e.preventDefault()
    if (file.current.files[0].size > 100 * 1024) {
      alert(`ขนาดของไฟล์ต้องไม่เกิน ${maxSize} KB`)
      return
    }
    const formData = new FormData(form.current)
    fetch('/api/upload', {
      method: 'POST',
      body: formData, // ส่ง FormData ขึ้นไปได้เลย
    })
      .then((res) => res.json())
      .then((result) => {
        form.current.reset()
        setImgSrc(result.imgSrc)
        setDesrc(result.desrc)
      })
      .catch((e) => alert(e.message))
  }
  return (
    <>
      <form ref={form} onSubmit={onSubmitForm} encType="multipart/form-data">
        <input type="file" name="image" accept="image/*" ref={file} />
        <br /> <br />
        <textarea name="description" cols="30" rows="3"></textarea> <br /> <br />
        <button>ส่งข้อมูล</button>
      </form>
      <br /> <br />
      {/* ตำแหน่งของรูปภาพ ต้องระบุ URL แบบเต็ม */}
      <img src={'http://localhost:8000/' + imgSrc} alt=" " />
      <br />
      <p>{desrc}</p>
    </>
  )
}
export default App
```

# วิธีการฝั่ง server

1. ติดตั้ง formidable library

```sh
npm install formidable
```

2. แนวทางการใช้งาน formidable เพื่อจัดเก็บไฟล์

```js
import formidable from 'formidable'

app.post('/api/upload', (req, res, next) => {
  let form = formidable({})
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err)
      return
    }
    // fields.ชื่ออินพุต เพื่อเข้าถึงอินพุตอื่นๆ ที่ไม่ใช่ไฟล์
    let description = fields.description

    // files.ชื่ออินพุตไฟล์ พื่อเข้าถึงข้อมูลของไฟล์ที่อัปโหลดขึ้นมา
    let upfile = files.image[0] // ข้อมูลรูปภาพขทั้งหมดใน index
    let fileName = upfile.originalFilename // ชื่อไฟล์ที่ถูกอัปเดทขึ้น
    let fileSize = upfile.size // ขนาดของไฟล์หน่วยเป็น byte
    let fileType = upfile.type // ขนาดของไฟล์แบบ MIME
    let filePath = upfile.filepath // ที่เก็บไฟล์ชั่วคราว

    res.json({ fields, files })
  })
})
```

#### Cookie

```sh
npm install cookie-parse  # server
```

```js
import cookieParser from 'cookie-parse'

app.use(cookieParser()) // การใช้งาน
```

1. การจัดเก็บข้อมูลแบบ Cookie (หมดอายุใน 30 วัน)

```js
let time = 60 * 60 * 1000 * 24 * 30 // millisecond
response.cookie('example', 555, { maxAge: time })
```

2. การอ่านข้อมูลจาก Cookie (ถ้าไม่มีค่า จะให้เป็นค่าว่าง)

```js
let firstname = request.cookies.firstname || ''
```

- กรณี error

```js
response.cookie('example', '5555')
let text = request.cookies.example // Error เพราะข้อมูลยังไม่ถูกส่งไปยัง Browser
```

3. การลบ Cookie

- แม้ระบุชื่อคุกกี้ที่ไม่มีอยู่จริง ก็จะไม่เกิดข้อผิดพลาด ดังนั้น จึงไม่จำเป็นต้องตรวจสอบก่อนการลบ

```js
response.clearCookie('login')
response.clearCookie('password')
```

- คุกกี้จะถูกลบ หลังจากที่เราส่งผลตอบสนอง
  - res.send()
  - res.json()
  - res.end()

# การใช้งาน Cookies

- รับข้อมูล Email (login) และ Password จากผู้ใช้
- พร้อมกับตัวเลือก (checkbox) ว่าจะบันทึกข้อมูลคุกกี้ไว้ในเครื่องหรือไม่
- เลือก (checkbox) บันทึก เมื่อเปิดมาครั้งต่อไป ค่า email และ password จาก cookies มาใส่ลงในช่องรับข้อมูลไว้ล่วงหน้า

#### Session

```sh
npm install express-session  # server
```

```js
import session from 'express-session'
// การใช้งาน
app.use(
  session({
    secret: 'reactrestapi', // กำหนด string อะไรก็ได้สำหรับเป็น key สร้าง Session ID
    resave: false,
    saveUninitialized: false,
  })
)
```

1. การจัดเก็บข้อมูลแบบ Session

```js
request.session.code = 12345
request.session['email'] = 'test@example.com'
request.session.colors = ['red', 'green', 'blue']
request.session.countries = { th: 'Thailand', jp: 'Japan', kr: 'Korea' }

request.session.cookie.maxAge = 30 * 60 * 1000 // หมดอายุใน 30 นาที
request.session.cookie.maxAge = 60 * 60 * 1000 * 24 // หมดอายุใน 1 วัน
```

2. การอ่านค่า Session

```js
let id = ''
if (request.session.id) {
  // != undefined
  id = request.session.id
}

// เขียนแบบสั้น
let password = request.session.password || ''

let colors = request.session.numbers || []
for (n of colors) {
}

let countries = request.session.countries || {}
for (c of countries) {
}
```

3. การลบข้อมูล Session (เมื่อออกจากระบบ)

```js
app.get('/api/session/delete', (request, response) => {
  request.session.destroy((err) => {
    if (err) {
      response.send(error)
    } else {
      response.json({ signedIn: false })
    }
  })
})
```

# การใช้งาน Session

- server
  - รับข้อมูล Email (Login) และ Password จากผู้ใช้
  - เมื่อส่งขึ้น หากกำหนดค่าได้ถูกต้อง จะนำไปเก็บไว้ใน session เพื่อตรวจสอบในภายหลัง
- local
  - หากเข้าสู่ระบบแล้ว ก็จะเปลี่ยนไปแสดงผลด้วย Component อีกอันหนึ่ง
  - แต่ถ้ายังไม่เข้าสู่ระบบ ก็จะแสดงฟอร์มเพื่อรับค่า email และ password

# GET สำหรับตรวจสอบว่ามีข้อมูลจัดเก็บใน Session หรือไม่

1. server (index.js)

```js
app.get('/api/session/get', (req, res) => {
  // ตรวจสอบว่ามีข้อมูลจัดเก็บไว้ใน sessions หรือไม่
  let s = req.session.email ? true : false
  res.json({ signedIn: s })
})
```

2. local (Session.jsx)

```js
let [signedIn, setSignedIn] = useState(false)

useEffect(() => {
  fetch('/api/session/get')
    .then((res) => res.json())
    .then((result) => setSignedIn(result.signedIn))
    .catch((err) => alert(err.message))
}, [])
```

# POST

1. server (index.js)

```js
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
```

2. local (Session.jsx)

```js
const form = useRef()

const onSubmitForm = (event) => {
  event.preventDefault()
  const formData = new FormData(form.current)
  const formEnt = Object.fromEntries(formData.entries())

  fetch('/api/session/set', {
    method: 'POST',
    body: JSON.stringify(formEnt),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.signedIn) {
        setSignedIn(result.signedIn)
      } else {
        alert('Email หรือ Password ไม่ถูกต้อง')
      }
    })
    .catch((err) => alert(err))
}

// ถ้าไม่เข้าสู่ระบบ ให้แสดง form
if (!signedIn) {
  return (
    <div>
      <form onSubmit={onSubmitForm} ref={form}>
        <input type="email" name="email" placeholder="Email" /> <br />
        <input type="password" name="password" placeholder="Password: 1234" />
        <br />
        <br />
        <button>ส่งข้อมูล</button>
      </form>
    </div>
  )
} else {
  return <SessionSignedIn />
}
```

# GET สำหรับการลบข้อมูลใน session เพื่อออกจากระบบ

1. server (index.js)

```js
app.get('/api/session/delete', (req, res) => {
  req.session.destroy((err) => {
    res.json({ signedIn: false })
  })
})
```

2. local (SessionSignedIn.jsx)

```js
const onClickLink = (event) => {
  event.preventDefault()
  fetch('/api/session/delete')
    .then((res) => res.text())
    .then((result) => (window.location.href = '/'))
    .catch((err) => alert(err))
}
return (
  <div>
    <h1>ท่านได้เข้าสู่ระบบแล้ว</h1>
    <br />
    <a href={''} onClick={(e) => onClickLink(e)}>
      ออกจากระบบ
    </a>
  </div>
)
```
