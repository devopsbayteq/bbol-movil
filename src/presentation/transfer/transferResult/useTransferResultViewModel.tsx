import {useState} from "react";


export const useTransferResultViewModel=()=>{

    const [idTransfer,setIdTransfer] = useState("")


    return{
        idTransfer,
        setIdTransfer
    }

}
