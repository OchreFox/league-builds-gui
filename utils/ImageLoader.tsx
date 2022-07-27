import { ImageLoader } from 'next/image'

export type StaticallyLoaderOptions = {
  src: string
  width?: number
  height?: number
  quality?: number
}
export const CustomLoader: ImageLoader = ({ src }: StaticallyLoaderOptions) => {
  return `https://cdn.ochrefox.net/${src}`
}
