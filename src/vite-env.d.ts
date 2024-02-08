/// <reference types="vite/client" />

declare module "*.css?inline" {
  const content: string;
  export default content;
}

declare module "*.svg?raw" {
  const content: `<svg ${string}</svg>`;
  export default content;
}
