import React from 'react'
import SimpleBar from 'simplebar-react'

const BuildSection = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="h-full w-full border border-yellow-900 ">
      <div className="relative">
        {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div> */}
        <input
          type="text"
          name="build-header"
          className="border-b-2 border-yellow-900 block w-full bg-yellow-900/50 focus:bg-brand-dark py-1 px-2 text-lg font-bold text-white placeholder-gray-300 placeholder:font-normal focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          placeholder="Section Title"
        />
      </div>
      <div className="px-2 py-3">{children}</div>
    </div>
  )
}

const Build = () => {
  return (
    <div className="absolute h-full w-full">
      <SimpleBar className="m-4 h-full overflow-y-auto">
        {/* Build Title */}
        <BuildSection>
          <p className="text-center text-gray-400">
            <em>Drag and drop items here</em>
          </p>
        </BuildSection>
      </SimpleBar>
    </div>
  )
}

export default Build
