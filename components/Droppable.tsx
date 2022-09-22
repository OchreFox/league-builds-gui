import { UniqueIdentifier, useDroppable } from '@dnd-kit/core'
import { cx } from '@emotion/css'
import React, { ReactNode } from 'react'

export function Droppable(props: { children?: ReactNode; id: UniqueIdentifier }) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  })
  const style = {
    opacity: isOver ? 1 : 0.5,
  }

  return (
    <div ref={setNodeRef} style={style} className={cx(isOver && 'bg-orange-900/50')}>
      {props.children}
    </div>
  )
}
