import { Button as FlowbiteButton } from 'flowbite-react';

function CustomButton({title, className, type="button", ...props}) {
  return (
    <FlowbiteButton 
      type={type} 
      className={`px-10 py-3 rounded-full capitalize ${className || ''}`}
      {...props}
    >
      {title}
    </FlowbiteButton>
  )
}

export default CustomButton