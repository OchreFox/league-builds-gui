import React from 'react'

import { UniqueIdentifier } from '@dnd-kit/core'
import { AnimateLayoutChanges, defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Item } from '@/types/Build'

const animateLayoutChanges: AnimateLayoutChanges = (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true })

const DroppableContainer = ({
  children,
  disabled,
  id,
  items,
  style,
  ...props
}: {
  children: React.ReactNode
  disabled?: boolean
  id: UniqueIdentifier
  items: Item[]
  style?: React.CSSProperties
}) => {
  const { active, attributes, isDragging, listeners, over, setNodeRef, transition, transform } = useSortable({
    id,
    data: {
      type: 'container',
      children: items,
    },
    animateLayoutChanges,
  })

  // For CSS hover effects
  const isOverContainer = over
    ? (id === over.id && active?.data.current?.type !== 'container') ||
      items.map((item) => item.id).includes(over.id as string)
    : false

  return (
    <div
      id={`droppable_container_${id}`}
      ref={disabled ? undefined : setNodeRef}
      style={{
        ...style,
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      // handleProps={{
      //   ...attributes,
      //   ...listeners,
      // }}
      {...props}
    >
      {children}
    </div>
  )
}

export default DroppableContainer
