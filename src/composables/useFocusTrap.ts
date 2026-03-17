import { watch, onBeforeUnmount, nextTick } from 'vue'
import type { Ref } from 'vue'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex^="-"])'

function getFocusables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

/**
 * Atrapa el foco dentro del contenedor y restaura el foco al elemento previo al cerrar.
 * Uso: pasar ref al nodo del dialog y ref booleano que indique si está abierto.
 */
export function useFocusTrap(
  containerRef: Ref<HTMLElement | null | undefined>,
  isActive: Ref<boolean>
) {
  let previousActive: HTMLElement | null = null
  let keydownHandler: ((e: KeyboardEvent) => void) | null = null

  function handleKeydown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return
    const el = containerRef.value
    if (!el) return
    const focusables = getFocusables(el)
    if (focusables.length === 0) return
    const current = document.activeElement as HTMLElement
    const currentIndex = focusables.indexOf(current)
    const last = focusables.length - 1
    if (e.shiftKey) {
      if (currentIndex <= 0) {
        e.preventDefault()
        focusables[last].focus()
      }
    } else {
      if (currentIndex === -1 || currentIndex >= last) {
        e.preventDefault()
        focusables[0].focus()
      }
    }
  }

  watch(
    isActive,
    (active) => {
      if (active) {
        previousActive = document.activeElement as HTMLElement | null
        keydownHandler = handleKeydown
        document.addEventListener('keydown', keydownHandler)
        nextTick(() => {
          const el = containerRef.value
          if (!el) return
          const focusables = getFocusables(el)
          if (focusables.length > 0) {
            focusables[0].focus()
          } else {
            el.setAttribute('tabindex', '-1')
            el.focus()
          }
        })
      } else {
        if (keydownHandler) {
          document.removeEventListener('keydown', keydownHandler)
          keydownHandler = null
        }
        nextTick(() => {
          if (previousActive && typeof previousActive.focus === 'function') {
            previousActive.focus()
          }
        })
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    if (keydownHandler) {
      document.removeEventListener('keydown', keydownHandler)
    }
  })
}
