import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Cookie from './Cookie'
import Session from './Session'

function App() {
  const [imgSrc, setImgSrc] = useState('')
  const [desrc, setDesrc] = useState('')
  const form = useRef()
  const file = useRef()

  const onSubmitForm = (e) => {
    e.preventDefault()
    const maxSize = 150
    if (file.current.files[0].size > maxSize * 1024) {
      alert(`ขนาดของไฟล์ต้องไม่เกิน ${maxSize} KB`)
      return
    }

    const formData = new FormData(form.current)

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
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
      <div>
        <img src={viteLogo} className="logo" alt="Vite logo" />
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <h1>Upload File</h1>
      <div className="card">
        <form ref={form} onSubmit={onSubmitForm} encType="multipart/form-data">
          <label>รูปภาพ:</label> &nbsp;
          <input
            type="file"
            name="image"
            accept="image/*"
            ref={file}
            required
          />
          <br /> <br />
          <textarea
            name="description"
            cols="30"
            rows="3"
          ></textarea> <br /> <br />
          <button>ส่งข้อมูล</button>
        </form>
        <br />
        <br />
        {/* ตำแหน่งของรูปภาพ ต้องระบุ URL แบบเต็ม */}
        <img
          src={'http://localhost:8000/' + imgSrc}
          alt=" "
          style={{ maxWidth: '300px' }}
        />
        <br />
        <p>{desrc}</p>
      </div>
      <br />
      <Cookie />
      <br />
      <Session />
    </>
  )
}

export default App
