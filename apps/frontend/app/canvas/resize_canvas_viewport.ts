export default function resize_canvas_viewport(
  handle_set_canvas_viewport_transform: (scale: number, x: number, y: number) => void,
  canvas: HTMLCanvasElement
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = window.innerWidth * 0.9;
  const height = window.innerHeight * 0.9;

  // The devicePixelRatio of Window interface returns the ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device.
  const dpr = window.devicePixelRatio || 1;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  handle_set_canvas_viewport_transform(dpr, 0, 0);
}
