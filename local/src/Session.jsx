import { useEffect, useRef, useState } from 'react'
import SessionSignedIn from './SessionSignedIn'

export default function Session() {
  let [signedIn, setSignedIn] = useState(false)
  const form = useRef()

  useEffect(() => {
    fetch('/api/session/get')
      .then((res) => res.json())
      .then((result) => setSignedIn(result.signedIn))
      .catch((err) => alert(err.message))
  }, [])

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
}
