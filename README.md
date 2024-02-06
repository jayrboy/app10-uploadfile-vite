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
