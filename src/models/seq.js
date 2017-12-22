const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SeqSchema = new Schema({
  model           : { type: String, required: true, index: { unique: true } },   // 模型名称
  seq             : { type: Number, default: 0 },                                // 自增长ID
})

module.exports = SeqSchema