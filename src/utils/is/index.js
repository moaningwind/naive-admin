import {
  isUndefined as isUnDef,
  isNil,
  isString,
  isSymbol,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isFunction,
  isSet,
  isMap,
} from 'lodash-es'

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

export const isBrowser = !isServer

export const isDef = val => !isUnDef(val)

export const toString = Object.prototype.toString

export function is(val, type) {
  return toString.call(val) === `[object ${type}]`
}

export function isPrimitive(val) {
  return isString(val) || isNumber(val) || isBoolean(val) || isNil(val) || isSymbol(val)
}

export function isReference(val) {
  return !isPrimitive(val)
}

export function isWindow(val) {
  return typeof isDef(window) && is(val, 'Window')
}

export function isPromise(val) {
  return isObject(val) && is(val, 'Promise') && isFunction(val.then) && isFunction(val.catch)
}

export function isJson(val) {
  // Es10 catch 可以不写error
  try {
    JSON.parse(val)
    return true
  } catch {
    return false
  }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// lodash的 isEmpty 不能用于判断基本数据类型 传入 Boolean Number 也会返回true
export function isEmpty(val) {
  if (isNumber(val)) return val === 0

  if (isString(val) || isArray(val)) return val.length === 0

  if (isObject(val)) return Object.keys(val).length === 0

  if (isMap(val) || isSet(val)) return val.size === 0

  return isNil(val)
}

export function isVisibleInViewport(el, isFullyVisible) {
  const { top, left, right, bottom } = el.getBoundingClientRect()
  const { innerHeight, innerWidth } = window
  return isFullyVisible
    ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top > 0 && left > 0 && bottom < innerHeight && right < innerWidth
}
