// Seq
export default {
  // 模型名称
  model: { 
    type: String, 
    required: true, 
    index: { unique: true } 
  },
  // 自增长ID
  seq: { 
    type: Number, 
    default: 0 
  }
}