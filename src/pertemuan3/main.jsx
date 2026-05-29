import { createRoot } from "react-dom/client";
import TailwindCSS from "./TailwindCSS";
import './tailwind.css';
import HitungGajiForm from "./HitungGajiForm";
import UserForm from "./UserForm";

createRoot (document.getElementById("root"))
    .render(
        <div>
            <TailwindCSS/>
            <UserForm/>
            <HitungGajiForm/>
        </div>
        )