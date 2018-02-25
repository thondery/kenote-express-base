
import gm from 'gm'
import { callback } from './index'
import { drawText } from '../config'

const getImageSize = (imageFile) => {
  return new Promise((resolve, reject) => {
    gm(imageFile).size((err, value) => callback(resolve, reject, err, value))
  })
}

const resizeImage = (imageFile, value, thumb, horizontal = true) => {
  let resizeVlue = horizontal ? [null, thumb.height] : [thumb.width, null]
  let valueWidth = resizeVlue[0] || resizeVlue[1] * (value.width / value.height)
  let valueHeight = resizeVlue[1] || resizeVlue[0] * (value.height / value.width)
  let cropValue = horizontal ? [(valueWidth - thumb.width) / 2] : [0, (valueHeight - thumb.height) / 2]
  return new Promise((resolve, reject) => {
    gm(imageFile)
      .resize(...resizeVlue)
      .crop(thumb.width, thumb.height, ...cropValue)
      .toBuffer((err, buffer) => callback(resolve, reject, err, buffer))
  })
}

const setDrawText = (imageFile) => {
  return new Promise((resolve, reject) => {
    gm(imageFile)
      .fill(drawText.color)
      .font(drawText.font, drawText.size)
      .drawText(5, 5, drawText.text, drawText.gravity)
      .toBuffer((err, buffer) => callback(resolve, reject, err, buffer))
  })
}

export const thumbnail = (imageFile, thumb) => {
  return getImageSize(imageFile)
    .then( value => {
      let thumbProp = thumb.width / thumb.height
      let valueProp = value.width / value.height
      return resizeImage(imageFile, value, thumb, thumbProp < valueProp)
    })
    .then( buffer => thumb.draw ? setDrawText(buffer) : buffer )
}

export const toBuffer = (imageFile) => setDrawText(imageFile)
