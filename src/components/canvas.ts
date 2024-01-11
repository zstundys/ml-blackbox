import { raise } from "@/lib/raise";

export class MlCanvas extends HTMLElement {
  #canvas = document.createElement('canvas')
  #ctx = this.#canvas.getContext('2d') ?? raise('Could not get canvas context');

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.appendChild(this.#canvas);

    this.#canvas.width = 800;
    this.#canvas.height = 600;
    
    this.#ctx.fillStyle = 'red';
    this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
  }

  connectedCallback() {
    console.log('Connected!');
    
  }
}

