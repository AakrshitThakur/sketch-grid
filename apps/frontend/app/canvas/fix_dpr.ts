export default function fix_dpi(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  // The devicePixelRatio of Window interface returns the ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device.
  const dpr = window.devicePixelRatio;

  const rect = canvas.getBoundingClientRect();

  // Set the "actual" size of the canvas
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // Set the "drawn" size of the canvas
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`; 

  // get context
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Scale the context to ensure correct drawing operations
  ctx.scale(dpr, dpr);
}
