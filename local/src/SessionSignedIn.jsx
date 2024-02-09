export default function SessionSignedIn() {
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
}
