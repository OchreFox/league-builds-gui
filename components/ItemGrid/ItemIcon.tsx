import Image from 'next/image'

import React, { useCallback, useMemo, useState } from 'react'

import { css, cx } from '@emotion/css'
import { useSelector } from 'react-redux'
import { ItemsSchema } from 'types/Items'

import { selectPotatoMode } from '@/store/potatoModeSlice'

import { blurhashDecode } from 'utils/BlurhashDecode'
import CustomLoader from 'utils/CustomLoader'

export const ItemIcon = ({
  size,
  item,
  className,
  usePlaceholder,
}: {
  size?: number
  item: ItemsSchema
  className?: string
  usePlaceholder?: boolean
}) => {
  const potatoMode = useSelector(selectPotatoMode)
  const [loaded, setLoaded] = useState(false)

  const loadCallback = useCallback(() => {
    setLoaded(true)
  }, [])

  const placeholder = useMemo(() => {
    if (!usePlaceholder) {
      return 'empty'
    }
    if (size && size <= 40) {
      return 'empty'
    }
    return 'blur'
  }, [size, usePlaceholder])

  const getPlaceholder = useMemo(() => {
    if (placeholder === 'blur') {
      return blurhashDecode(item.placeholder)
    }
    return ''
  }, [item.placeholder, placeholder])

  return (
    <div
      className={cx(
        'pointer-events-none flex self-center overflow-hidden border border-black object-cover ring-1 ring-yellow-700 transition duration-100 group-hover:z-30 group-hover:ring-2 group-hover:brightness-125',
        className
      )}
    >
      <Image
        loader={CustomLoader}
        width={size ?? 50}
        height={size ?? 50}
        src={item.icon ?? ''}
        alt={item.name ?? ''}
        placeholder={placeholder}
        blurDataURL={getPlaceholder}
        onLoadingComplete={loadCallback}
        className={cx(
          !potatoMode && placeholder === 'blur' && 'blur-xl',
          !potatoMode &&
            placeholder === 'blur' &&
            loaded &&
            css`
              animation: unblur 0.5s cubic-bezier(0.87, 0, 0.13, 1) forwards;
              @keyframes unblur {
                0% {
                  filter: blur(24px);
                }
                100% {
                  filter: blur(0px);
                }
              }
            `
        )}
      />
    </div>
  )
}
