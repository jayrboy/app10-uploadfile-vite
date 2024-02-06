import { useEffect, useRef, useState } from 'react'

const Cookie = () => {
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')
  const form = useRef()
  const checkbox = useRef()

  //TODO: ตรวจสอบว่าได้จัดเก็บ email และ password ในแบบ cookies ไว้หรือไม่้
  useEffect(() => {
    fetch('/api/cookie/get')
      .then((res) => res.json())
      .then((result) => {
        checkbox.current.checked = result.save
        setEmail(result.email)
        setPassword(result.password)
      })
      .catch((err) => alert(err))
  }, [])

  //TODO: เมื่อส่งข้อมูลจาก form ออกไป
  const onSubmitForm = (event) => {
    event.preventDefault()
    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    fetch('/api/cookie/set', {
      method: 'POST',
      body: JSON.stringify(formEnt),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.text())
      .then((result) => alert(result))
      .catch((err) => alert(err))
  }
  return (
    <div>
      <form onSubmit={onSubmitForm} ref={form}>
        <input
          type="email"
          name="email"
          defaultValue={email}
          placeholder="Email (Login)"
        />
        <br />
        <input
          type="password"
          name="password"
          defaultValue={password}
          placeholder="Password"
        />
        <br />
        <input type="checkbox" name="save" ref={checkbox} />{' '}
        &nbsp;บันทึกข้อมูลไว้ในเครื่อง
        {/* defaultChecked ใช้ไม่ได้ผล */}
        <br />
        <br />
        <button>ส่งข้อมูล</button>
      </form>
    </div>
  )
}
export default Cookie
