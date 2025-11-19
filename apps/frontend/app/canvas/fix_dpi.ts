export default function fix_dpi(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  // The devicePixelRatio of Window interface returns the ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device.
  const dpi = window.devicePixelRatio;

  // The Window.getComputedStyle() method returns an object containing the values of all CSS properties of an element, after applying active stylesheets and resolving any basic computation those values may contain.
  const style_height = +window.getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
  const style_width = +window.getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);

  canvas.setAttribute("height", `${style_height * dpi}`);
  canvas.setAttribute("width", `${style_width * dpi}`);
}
