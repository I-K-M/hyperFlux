import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
  }

const Button: React.FC<ButtonProps> = ({ type = 'button', onClick, children, ...rest }) => {
    return (
        <div className="flex p-2 items-center justify-around">
            <button className="bg-black" type={type} onClick={onClick} {...rest}>
                <span className="block text-black -translate-x-2 font-bold -translate-y-2 border-2 border-black bg-yellow-500 p-3 text-xl hover:-translate-y-2.5 
                active:translate-x-0 active:translate-y-0
                transition-all">
                    {children}
                    </span>
            </button>
        </div>
    )
}
export default Button;