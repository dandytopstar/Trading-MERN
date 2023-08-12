import React, {FC, useRef} from 'react';
import useOnClickOutside from './useClickOutside';
import './index.css'

const Modal = (props)=>{
    const ref = useRef();
    useOnClickOutside(ref,props.close)
    return (
        <>
        
        {props.visible && 
            <div className="modal-back" >
            <div className={props.extend == true ? 'modal-custom-extend' :'modal-custom'} ref={ref}>
                <div className="modal-header">
                    <div className='modal-title'>
                        {props.title}
                    </div>
                    <div>
                        <a onClick={props.close}> × </a>
                        
                    </div>
                </div>
                <div className='term-div' style={{overflowY : 'auto', height : '500px', marginTop : "24px"}}>
                    {props.children}
                </div>
            </div>
        </div>
        }
        </>
        
    )
}

export default Modal;