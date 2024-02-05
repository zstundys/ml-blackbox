import { raise } from "@/lib/raise";
import styles from "./canvas.css?inline";
import { draw } from "@/lib/draw";

export type MousePosition = [x: number, y: number];

export class MlCanvas extends HTMLElement {
  readonly #canvas = document.createElement("canvas");
  readonly #ctx =
    this.#canvas.getContext("2d") ?? raise("Could not get canvas context");

  readonly shadowRoot = this.attachShadow({ mode: "open" });
  #isDrawing = false;
  #paths: MousePosition[][] = [];

  constructor() {
    super();

    this.shadowRoot.appendChild(this.#canvas);

    const style = document.createElement("style");
    style.textContent = styles;
    this.shadowRoot.appendChild(style);

    this.#canvas.width = 800;
    this.#canvas.height = 600;

    this.#ctx.fillStyle = "white";
    this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
  }

  connectedCallback() {
    this.addEventListener("pointerdown", (event) => {
      const mouse = this.#getMousePosition(event);

      this.#isDrawing = true;
      this.#paths.push([mouse]);
    });

    this.addEventListener("pointermove", (event) => {
      if (!this.#isDrawing) return;
      const mouse = this.#getMousePosition(event);

      this.#isDrawing = true;
      this.#paths.at(-1)?.push(mouse);
      this.#redraw();
    });

    this.addEventListener("pointerup", () => {
      this.#isDrawing = false;
    });
  }

  #redraw() {
    this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);

    draw.paths(this.#ctx, this.#paths);
  }

  #getMousePosition(event: PointerEvent): MousePosition {
    const rect = this.#canvas.getBoundingClientRect();

    return [
      Math.round(event.clientX - rect.left),
      Math.round(event.clientY - rect.top),
    ];
  }
}
