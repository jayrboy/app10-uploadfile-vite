import express from 'express'
import fs from 'fs'
import formidable from 'formidable'

const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

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
