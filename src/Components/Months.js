import {useState,useEffect,useRef} from "react";
import DropdownMonth from "./DropdownMonth";
import TabMenu from "./TabMenu";

const Months = ({items,depthLevel}) => {
    const [dropdownMonth, setDropdownMonth] = useState(false);

    let ref = useRef();

    useEffect(() => {
        const handler = (event) => {
            if (dropdownMonth && ref.current && !ref.current.contains(event.target)) {
                setDropdownMonth(false);
            }
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, [dropdownMonth]);

    const onMouseEnter = () => {
        window.innerWidth > 960 && setDropdownMonth(true);
    };

    const onMouseLeave = () => {
        window.innerWidth > 960 && setDropdownMonth(false);
    };

    return ( 
    <div>
    <li className = "menu-items"
        ref = {ref}
        onMouseEnter = {onMouseEnter}
        onMouseLeave = {onMouseLeave} >
        {
            items.submenu ? ( 
            <>
            <button type = "button"
                aria-haspopup = "menu"
                aria-expanded = {dropdownMonth ? "true" : "false"}
                onClick = {() => setDropdownMonth((prev) => !prev)} 
                >
                {items.title} {" "} {depthLevel > 0 ? < span > &raquo; </span> : <span className="arrow" />} 
                </button> 
                <DropdownMonth depthLevel = {depthLevel}
                submenus = {items.submenu}
                dropdownMonth = {dropdownMonth}
                /> </>
            ) : ( 
            <a href = "/#" > {items.title} </a>
            )
        } 
        </li>
        </div>
        
    );
};

export default Months;