import { BiRadioCircle } from 'react-icons/bi';
import { LuMoreHorizontal } from 'react-icons/lu';
import { AiFillCloseCircle, AiFillWarning } from 'react-icons/ai';
import { BiSignal2, BiSignal3, BiSignal4 } from 'react-icons/bi';
import { FaCircleHalfStroke } from "react-icons/fa6";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { FaRegCircleStop } from "react-icons/fa6";

export const getPriorityIcon = (priority) => {
    switch (priority) {
        case "No priority": return <LuMoreHorizontal color="#797d84" size={20} />;
        case "Low": return <BiSignal2 color='#6b6f76' size={20} />;
        case "Medium": return <BiSignal3 color='#6b6f76' size={20} />;
        case "High": return <BiSignal4 color='#6b6f76' size={20} />;
        case "Urgent": return <AiFillWarning color='#fc7840' size={20} />;
        default: return <AiFillWarning color='#fc7840' size={20} />;
    }
};

export const getStatusIcon = (status) => {
    switch (status) {
        case "Backlog": return <FaRegCircleStop color='#6b6f76' size={24} />;
        case "Todo": return <BiRadioCircle color='#6b6f76' size={24} />;
        case "In progress": return <FaCircleHalfStroke color='#f1ca4b' size={16} />;
        case "Done": return <IoCheckmarkDoneCircleSharp color='#5e6ad2' size={16} />;
        case "Canceled": return <MdCancel color='#94a2b3' size={16} />;
        default: return <AiFillCloseCircle color='#94a2b3' size={16} />;
    }
};
