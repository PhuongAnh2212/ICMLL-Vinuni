import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export { gsap, ScrollTrigger };
if (typeof window !== "undefined") (window as unknown as { __gsap: typeof gsap }).__gsap = gsap; // TEMP-DEBUG
