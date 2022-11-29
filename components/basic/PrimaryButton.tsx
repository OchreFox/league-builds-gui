import Button, { BaseButtonProps } from './Button'

export const PrimaryButton = ({
  label,
  icon,
  labelReactive,
  iconReactive,
  dropReactive,
  handleClick,
  handleDrop,
}: BaseButtonProps) => {
  return (
    <Button
      label={label}
      icon={icon}
      background="bg-brand-default"
      color="text-white"
      reactive={true}
      labelReactive={labelReactive}
      iconReactive={iconReactive}
      bgClick="bg-green-400"
      colorReactive="text-black"
      rounded="rounded-full"
      dropReactive={dropReactive}
      handleClick={handleClick}
      handleDrop={handleDrop}
    />
  )
}
