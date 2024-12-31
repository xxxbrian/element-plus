// @ts-nocheck
import { h } from 'vue'
import { addUnit } from '@element-plus/utils'

export function hColgroup(props) {
  const isAuto = props.tableLayout === 'auto'
  let columns = props.columns || []
  if (isAuto) {
    if (columns.every((column) => column.width === undefined)) {
      columns = []
    }
  }
  const getPropsData = (column) => {
    const propsData = {
      key: `${props.tableLayout}_${column.id}`,
      style: {},
      name: undefined,
    }
    if (isAuto) {
      propsData.style = {
        width: addUnit(`${column.width}px`),
      }
    } else {
      propsData.name = column.id
      propsData.style = {
        width: addUnit(`${column.width}px`),
      }
    }
    return propsData
  }

  return h(
    'colgroup',
    {},
    columns.map((column) => h('col', getPropsData(column)))
  )
}

hColgroup.props = ['columns', 'tableLayout']
