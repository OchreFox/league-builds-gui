import { UniqueIdentifier, useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import React, { CSSProperties, ReactNode } from 'react'

export function Draggable(props: { children?: ReactNode; id: UniqueIdentifier; data: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: props.id,
    data: props.data,
  })
  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  )
}
