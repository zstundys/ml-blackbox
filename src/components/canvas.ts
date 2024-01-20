import { raise } from "@/lib/raise";
import styles from './canvas.css?inline';

export class MlCanvas extends HTMLElement {
  #canvas = document.createElement('canvas')
  #ctx = this.#canvas.getContext('2d') ?? raise('Could not get canvas context');

  shadowRoot = this.attachShadow({ mode: 'open' });;

  constructor() {
    super();

    this.shadowRoot.appendChild(this.#canvas);

    const style = document.createElement('style');
    style.textContent = styles;
    this.shadowRoot.appendChild(style);

    this.#canvas.width = 800;
    this.#canvas.height = 600;

    this.#ctx.fillStyle = 'red';
    this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
  }


  connectedCallback() {
  }
}

