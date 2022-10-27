import { ImageLoader } from 'next/image'

import { LoaderOptions } from '../types/App'

export const StaticallyLoader: ImageLoader = ({ src, width, quality }: LoaderOptions) => {
  let options = []
  if (width) {
    options.push(`w=${width}`)
    options.push(`h=${width}`)
  }
  if (quality) {
    options.push(`q=${quality}`)
  }
  options.push(`f=auto`)
  let optionsString = options.length > 0 ? options.join(',') + '/' : ''
  return `https://cdn.statically.io/img/cdn.ochrefox.net/${optionsString}${src}`
}

export default StaticallyLoader
