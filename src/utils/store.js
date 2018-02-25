
import * as local from './store_local'
import qn from './store_qn'

export default (store, opts = null) => {
  if (store === 'qn') {
    return qn(opts)
  }
  return local
}