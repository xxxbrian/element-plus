import { inject } from 'vue'
import { isNumber, isObject, isString, isStringNumber } from '../types'
import { isClient } from '../browser'
import { camelize } from '../strings'
import { entriesOf, keysOf } from '../objects'
import { debugWarn } from '../error'
import type { CSSProperties } from 'vue'

const SCOPE = 'utils/dom/style'

export const classNameToArray = (cls = '') =>
  cls.split(' ').filter((item) => !!item.trim())

export const hasClass = (el: Element, cls: string): boolean => {
  if (!el || !cls) return false
  if (cls.includes(' ')) throw new Error('className should not contain space.')
  return el.classList.contains(cls)
}

export const addClass = (el: Element, cls: string) => {
  if (!el || !cls.trim()) return
  el.classList.add(...classNameToArray(cls))
}

export const removeClass = (el: Element, cls: string) => {
  if (!el || !cls.trim()) return
  el.classList.remove(...classNameToArray(cls))
}

export const getStyle = (
  element: HTMLElement,
  styleName: keyof CSSProperties
): string => {
  if (!isClient || !element || !styleName) return ''

  let key = camelize(styleName)
  if (key === 'float') key = 'cssFloat'
  try {
    const style = (element.style as any)[key]
    if (style) return style
    const computed: any = document.defaultView?.getComputedStyle(element, '')
    return computed ? computed[key] : ''
  } catch {
    return (element.style as any)[key]
  }
}

export const setStyle = (
  element: HTMLElement,
  styleName: CSSProperties | keyof CSSProperties,
  value?: string | number
) => {
  if (!element || !styleName) return

  if (isObject(styleName)) {
    entriesOf(styleName).forEach(([prop, value]) =>
      setStyle(element, prop, value)
    )
  } else {
    const key: any = camelize(styleName)
    element.style[key] = value as any
  }
}

export const removeStyle = (
  element: HTMLElement,
  style: CSSProperties | keyof CSSProperties
) => {
  if (!element || !style) return

  if (isObject(style)) {
    keysOf(style).forEach((prop) => removeStyle(element, prop))
  } else {
    setStyle(element, style, '')
  }
}

export function addUnit(value?: string | number, defaultUnit = 'vw') {
  if (!value) return ''
  const viewportWidth = inject('viewportWidth', 1920)

  if (isNumber(value) || isStringNumber(value)) {
    return `${((Number(value) / viewportWidth) * 100).toFixed(5)}${defaultUnit}`
  } else if (isString(value)) {
    const match = value.match(/^([+-]?\d*\.?\d+)([a-zA-Z%]*)$/)
    if (match) {
      const [, numStr, unit] = match
      const num = Number.parseFloat(numStr)

      if (unit === 'px') {
        return `${((num / viewportWidth) * 100).toFixed(5)}${defaultUnit}`
      }

      if (unit === '%') {
        return `${num}${unit}`
      }

      return `${numStr}${unit}`
    }

    return value
  }

  debugWarn(SCOPE, 'binding value must be a string or number')
}
