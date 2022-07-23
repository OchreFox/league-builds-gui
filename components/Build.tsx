import { Icon } from '@iconify/react'
import React from 'react'
import SimpleBar from 'simplebar-react'

const BuildSection = ({ icon, children }: { icon: JSX.Element; children: JSX.Element }) => {
  return (
    <div className="h-full w-full border border-yellow-900 ">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div>
        <input
          type="text"
          name="build-header"
          className="block w-full bg-brand-default py-1 pl-10 text-lg font-bold text-white placeholder-gray-300 placeholder:font-normal focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          placeholder="Section Title"
        />
      </div>
      {children}
    </div>
  )
}

const Build = () => {
  return (
    <div className="absolute h-full w-full">
      <SimpleBar className="m-4 h-full overflow-y-auto">
        {/* Build Title */}
        <BuildSection icon={<Icon icon="tabler:edit" className="h-5 w-5 text-white" />}>
          <div className="p-3">content</div>
        </BuildSection>
      </SimpleBar>
    </div>
  )
}

export default Build
