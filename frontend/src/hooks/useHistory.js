import { useState, useCallback } from 'react'

export function useHistory(initial = []) {
  const [stack, setStack] = useState([initial])
  const [index, setIndex] = useState(0)

  const current = stack[index]

  const push = useCallback((newState) => {
    setStack(s => {
      const next = [...s.slice(0, index + 1), newState]
      return next.slice(-60) // keep last 60 states
    })
    setIndex(i => Math.min(i + 1, 59))
  }, [index])

  const undo = useCallback(() => {
    if (index <= 0) return null
    const nextIdx = index - 1
    setIndex(nextIdx)
    return stack[nextIdx]
  }, [index, stack])

  const redo = useCallback(() => {
    if (index >= stack.length - 1) return null
    const nextIdx = index + 1
    setIndex(nextIdx)
    return stack[nextIdx]
  }, [index, stack])

  const canUndo = index > 0
  const canRedo = index < stack.length - 1

  return { current, push, undo, redo, canUndo, canRedo }
}
