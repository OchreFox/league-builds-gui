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
      bgColor="bg-brand-default"
      color="text-white"
      bold={true}
      reactive={true}
      labelReactive={labelReactive}
      iconReactive={iconReactive}
      bgClick="focus:bg-green-400"
      colorReactive="text-black"
      rounded="rounded-full"
      dropReactive={dropReactive}
      handleClick={handleClick}
      handleDrop={handleDrop}
      className="py-5"
    />
  )
}
