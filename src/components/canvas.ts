import { raise } from "@/lib/raise";
import styles from "./canvas.css?inline";
import { draw } from "@/lib/draw";
import undoSvg from "./undo.svg?raw";

export type MousePosition = [x: number, y: number];

export class MlCanvas extends HTMLElement {
  readonly #dom = {
    canvas: document.createElement("canvas"),
    undoButton: document.createElement("button"),
    style: document.createElement("style"),
  };
  readonly #ctx =
    this.#dom.canvas.getContext("2d") ?? raise("Could not get canvas context");

  readonly shadowRoot = this.attachShadow({ mode: "open" });
  #isDrawing = false;
  #paths: MousePosition[][] = [];

  constructor() {
    super();

    this.#dom.canvas.width = Math.min(800, window.innerWidth * 0.9);
    this.#dom.canvas.height = Math.min(600, window.innerHeight * 0.9);
    this.shadowRoot.appendChild(this.#dom.canvas);

    this.#dom.undoButton.innerHTML = `${undoSvg}<span class="sr-only">Undo</span>`;
    this.shadowRoot.appendChild(this.#dom.undoButton);

    this.#dom.style.textContent = styles;
    this.shadowRoot.appendChild(this.#dom.style);

    this.#ctx.fillStyle = "white";
    this.#ctx.fillRect(0, 0, this.#dom.canvas.width, this.#dom.canvas.height);

    this.setAttribute("data-state", "idle");
  }

  connectedCallback() {
    this.#addEventListeners();
    this.#redraw();
  }

  #addEventListeners() {
    this.#dom.canvas.addEventListener("pointerdown", (event) =>
      this.#handleDrawStart(event),
    );
    this.#dom.canvas.addEventListener("touchstart", (event) =>
      this.#handleDrawStart(event.touches[0]),
    );

    this.#dom.canvas.addEventListener("pointermove", (event) =>
      this.#handleDrawMove(event),
    );
    this.#dom.canvas.addEventListener("touchmove", (event) =>
      this.#handleDrawMove(event.touches[0]),
    );

    this.#dom.canvas.addEventListener("pointerup", () => this.#handleDrawEnd());
    this.#dom.canvas.addEventListener("touchend", () => this.#handleDrawEnd());

    this.#dom.undoButton.addEventListener("click", () => {
      this.#paths.pop();
      this.#redraw();
    });
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
    this.#ctx.fillRect(0, 0, this.#dom.canvas.width, this.#dom.canvas.height);

    draw.paths(this.#ctx, this.#paths);

    this.#dom.undoButton.disabled = this.#paths.length === 0;
  }

  #getMousePosition(event: PointerEvent | Touch): MousePosition {
    const rect = this.#dom.canvas.getBoundingClientRect();

    return [
      Math.round(event.clientX - rect.left),
      Math.round(event.clientY - rect.top),
    ];
  }
}
