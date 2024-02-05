import type { MousePosition } from "@/components/canvas";

export const draw = {
  path: (
    ctx: CanvasRenderingContext2D,
    path: MousePosition[],
    color = "black"
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(...path[0]);

    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(...path[i]);
    }

    ctx.stroke();
  },

  paths: (
    ctx: CanvasRenderingContext2D,
    paths: MousePosition[][],
    color = "black"
  ) => {
    for (const path of paths) {
      draw.path(ctx, path, color);
    }
  },
};
