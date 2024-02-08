import "./style.css";
import { MlCanvas } from "./components/canvas";

let index = 0;
const labels = [
  "car",
  "fish",
  "house",
  "tree",
  "bicycle",
  "guitar",
  "pencil",
  "clock",
];

const data = {
  student: null,
  session: Date.now(),
  drawings: {},
};

customElements.define("ml-canvas", MlCanvas);
