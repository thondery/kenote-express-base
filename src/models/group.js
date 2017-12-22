
module.exports = {
  id              : { type: Number, default: 0, index: { unique: true } },       // 自动编号
  name            : { type: String, required: true },                            // 用户组名
  level           : { type: Number, default: 0 },                                // 用户组等级
  flag            : { type: Array, default: [] },                                // 用户组权限
  lock            : { type: Boolean, default: false },                           // 用户组锁
  list            : { type: Number, default: 9999 },                             // 排序编号
  desc            : { type: String },                                            // 用户组描述
}