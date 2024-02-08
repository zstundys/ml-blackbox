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

    this.setAttribute("data-state", "idle");
    this.shadowRoot.appendChild(this.#canvas);

    const style = document.createElement("style");
    style.textContent = styles;
    this.shadowRoot.appendChild(style);

    this.#canvas.width = Math.min(800, window.innerWidth * 0.9);
    this.#canvas.height = Math.min(600, window.innerHeight * 0.9);

    this.#ctx.fillStyle = "white";
    this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
  }

  connectedCallback() {
    this.addEventListener("pointerdown", (event) =>
      this.#handleDrawStart(event)
    );
    this.addEventListener("touchstart", (event) =>
      this.#handleDrawStart(event.touches[0])
    );

    this.addEventListener("pointermove", (event) =>
      this.#handleDrawMove(event)
    );
    this.addEventListener("touchmove", (event) =>
      this.#handleDrawMove(event.touches[0])
    );

    this.addEventListener("pointerup", () => this.#handleDrawEnd());
    this.addEventListener("touchend", () => this.#handleDrawEnd());
  }

  #handleDrawStart(event: PointerEvent | Touch) {
    const mouse = this.#getMousePosition(event);

    this.#isDrawing = true;
    this.setAttribute("data-state", "active");
    this.#paths.push([mouse]);
  }

  #handleDrawMove(event: PointerEvent | Touch) {
    if (!this.#isDrawing) return;
    const mouse = this.#getMousePosition(event);

    this.#paths.at(-1)?.push(mouse);
    this.#redraw();
  }

  #handleDrawEnd() {
    this.#isDrawing = false;
    this.setAttribute("data-state", "idle");
  }

  #redraw() {
    this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);

    draw.paths(this.#ctx, this.#paths);
  }

  #getMousePosition(event: PointerEvent | Touch): MousePosition {
    const rect = this.#canvas.getBoundingClientRect();

    return [
      Math.round(event.clientX - rect.left),
      Math.round(event.clientY - rect.top),
    ];
  }
}
