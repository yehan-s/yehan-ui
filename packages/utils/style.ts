import { isNumber, isString } from 'lodash-es'
import { debugWarn } from './error'

const SCOPR = 'utils/style' as const

const isStringNumber = (val: string): boolean => {
  if (!isString(val)) return false
  return true
}

export function addUnit(val?: string | number, defaultUnit = 'px') {
  if (!val) return ''
  if (isNumber(val) || isStringNumber(val)) return `${val}${defaultUnit}`
  if (isString(val)) return val
  debugWarn(SCOPR, 'binding value must be a string or number')
}
