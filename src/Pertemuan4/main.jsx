import { createRoot } from "react-dom/client";
import './tailwind.css';
// import FrameworkList from "./FrameworkList";
import FrameworkListSearchFilter from "./FrameworkListSearchFilter";
import ResponsivGrid from "./ResponsivGrid";


createRoot (document.getElementById("root"))
    .render(
        <div>
            {/* <FrameworkList/> */}
           {/* <FrameworkListSearchFilter/> */}
           <ResponsivGrid/>        
        </div>
        )