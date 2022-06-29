import {useState,useEffect,useRef} from "react";
import { menuItems } from "../menuItems";
import Dropdown from "./Dropdown";
import TabMenu from "./TabMenu";

const MenuItems = ({items,depthLevel}) => {

    let link = `${items.powerUrl}`;

    const [dropdown, setDropdown] = useState(false);

    let ref = useRef();

    useEffect(() => {
        const handler = (event) => {
            if (dropdown && ref.current && !ref.current.contains(event.target)) {
                setDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, [dropdown]);

    const onMouseEnter = () => {
        window.innerWidth > 960 && setDropdown(true);
    };

    const onMouseLeave = () => {
        window.innerWidth > 960 && setDropdown(false);
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
            <a href={link}
                aria-haspopup = "menu"
                aria-expanded = {dropdown ? "true" : "false"}
                onClick = {() => setDropdown((prev) => !prev)} 
                >
                {items.title} {" "} {depthLevel > 0 ? < span > &raquo; </span> : <span className="arrow" />}
            </a>
                <Dropdown depthLevel = {depthLevel}
                submenus = {items.submenu}
                dropdown = {dropdown}
                /> 
                </>
            ) : ( 
            <a href = {link} > {items.title} </a>
            )
        } 
        </li>
        </div>
        
    );
};

export default MenuItems;