import Months from "./Months";
import TabMenu from "./TabMenu";
const DropdownMonth = ({submenus,dropdownMonth,depthLevel}) => {
    depthLevel = depthLevel + 1;
    const dropdownMonthClass = depthLevel > 1 ? "dropdownMonth-submenu" : "";
    return ( 
    <ul className = {
            `dropdownMonth ${dropdownMonthClass} ${dropdownMonth ? "show" : ""}`
        } > {
            submenus.map((submenu, index) => ( 
                <Months items = {submenu}
                key = {index}
                depthLevel = {depthLevel}
                />
            ))
        }
        </ul>
    );
};

export default DropdownMonth;