import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import Google Fonts
const montserrat = document.createElement("link");
montserrat.rel = "stylesheet";
montserrat.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap";
document.head.appendChild(montserrat);

const openSans = document.createElement("link");
openSans.rel = "stylesheet";
openSans.href = "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600&display=swap";
document.head.appendChild(openSans);

const firaCode = document.createElement("link");
firaCode.rel = "stylesheet";
firaCode.href = "https://fonts.googleapis.com/css2?family=Fira+Code&display=swap";
document.head.appendChild(firaCode);

// Import Font Awesome Icons
const fontAwesome = document.createElement("link");
fontAwesome.rel = "stylesheet";
fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css";
document.head.appendChild(fontAwesome);

// Set page title
document.title = "TechieKraft EdTech Platform";

createRoot(document.getElementById("root")!).render(<App />);
