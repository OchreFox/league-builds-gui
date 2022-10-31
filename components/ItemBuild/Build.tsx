import { addEmptyBlock, selectItemBuild } from '@/store/itemBuildSlice'
import { useAppDispatch } from '@/store/store'
import { AnimatePresence } from 'framer-motion'
import React, { createRef } from 'react'
import { useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'

import Button from 'components/basic/Button'

import { BuildSection } from './BuildSection'

const Build = () => {
  const dispatch = useAppDispatch()
  const { blocks } = useSelector(selectItemBuild)
  const itemGridRef = createRef<HTMLDivElement>()

  return (
    <div className="absolute h-full w-full">
      <SimpleBar className="h-full overflow-y-auto justify-center" scrollableNodeProps={{ ref: itemGridRef }}>
        <div className="flex flex-col m-4">
          <AnimatePresence>
            {blocks.map((block, index) => (
              <BuildSection key={index} id={block.id} />
            ))}
            <Button
              label="Add Section"
              icon="tabler:apps"
              background="bg-brand-default"
              color="text-white"
              reactive={true}
              labelReactive="Added"
              iconReactive="tabler:check"
              bgClick="bg-green-400"
              colorReactive="text-black"
              rounded="rounded-full"
              handleClick={() => {
                dispatch(addEmptyBlock())
              }}
            />
          </AnimatePresence>
        </div>
      </SimpleBar>
    </div>
  )
}

export default Build
