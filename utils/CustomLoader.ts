import { ImageLoader } from 'next/image'

import { LoaderOptions } from '../types/App'

export const CustomLoader: ImageLoader = ({ src }: LoaderOptions) => {
  return `https://cdn.ochrefox.net/${src}`
}

export default CustomLoader
