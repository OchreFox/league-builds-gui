import { ImageLoader } from 'next/image'

export type StaticallyLoaderOptions = {
  src: string
  width?: number
  height?: number
  quality?: number
}
export const StaticallyLoader: ImageLoader = ({ src, width, quality }: StaticallyLoaderOptions) => {
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
