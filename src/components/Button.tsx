import React, {useState} from "react";
import {Icon, IconifyIcon} from "@iconify/react";

interface IconButtonProps {
    icon: IconifyIcon | string
    iconSize?: number
    className?: string
}

const IconButton: React.FC<IconButtonProps> = ({ icon, iconSize, className }) => {
    const [hover, setHover] = useState(false);

    return (
        <button
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}
            onClick={() => console.log("Icon btn clicked")}
            className={`h-0 p-0 rounded cursor-pointer ${hover ? 'text-white' : 'text-gray-500'} ${className}`}>
            <Icon icon={icon} width={iconSize??16} height={iconSize??16}/>
        </button>
    )
}

interface TextButtonProps {
    text: string
}

const TextButton: React.FC<TextButtonProps> = ({ text }) => {
    const [hover, setHover] = useState(false);

    return (
        <button
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}
            onClick={() => console.log("Btn clicked")}
            className="bg-zinc-700 p-0 rounded">
            {text}
        </button>
    )
}

export { IconButton, TextButton }