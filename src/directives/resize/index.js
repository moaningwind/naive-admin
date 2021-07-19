import { isFunction } from 'lodash-es'
import { addResizeListener, removeResizeListener } from '@/utils/event'

const resize = {
  handleAddListener(el, binding) {
    if (isFunction(binding.value)) {
      el.__handleResize__ = binding.value
      addResizeListener(el, el.__handleResize__)
    }
  },
  handleRemoveListener(el) {
    if (el.__handleResize__) {
      removeResizeListener(el, el.__handleResize__)
    }
  },
}

export default {
  bind(el, binding) {
    resize.handleAddListener(el, binding)
  },
  // componentUpdated(el, binding) {
  //   resize.handleRemoveListener(el)
  //   resize.handleAddListener(el, binding)
  // },
  unbind(el) {
    resize.handleRemoveListener(el)
  },
}
