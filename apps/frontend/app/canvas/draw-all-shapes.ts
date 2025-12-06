import { Shapes } from "@/types/whiteboard.types";

export default function draw_all_shapes(shapes: Shapes, ctx: CanvasRenderingContext2D) {
  // iterating shapes global array
  shapes.forEach((shape) => {
    switch (shape.type) {
      case "circle": {
        // A path = the shape you describe with drawing commands. It won’t appear until you stroke() or fill() it. Path2D lets you build a shape once and reuse it.
        // beginPath() -> Forget all previous lines and start fresh
        ctx.beginPath();
        // print shape on canvas
        ctx.arc(shape.center.x, shape.center.y, shape.radius, 0, 2 * Math.PI, false);
        ctx.stroke();
        break;
      }
      case "box": {
        // print shape on canvas
        ctx.strokeRect(shape.point.x, shape.point.y, shape.width, shape.height);
        break;
      }
      case "arrow": {
        ctx.beginPath();
        // draw line
        ctx.moveTo(shape.points.start.x, shape.points.start.y);
        ctx.lineTo(shape.points.end.x, shape.points.end.y);
        ctx.stroke();

        // Math.atan2() static method returns the angle in the plane (in radians) between the positive x-axis and the ray from (0, 0) to the point (x, y), for Math.atan2(y, x).
        // Note: With atan2(), the y coordinate is passed as the first argument and the x coordinate is passed as the second argument.
        const angle = Math.atan2(shape.points.end.y - shape.points.start.y, shape.points.end.x - shape.points.start.x);
        const head_length = 15;

        // drawing 2 lines forming arrow-head
        // haven't understood it
        ctx.beginPath();
        ctx.moveTo(shape.points.end.x, shape.points.end.y);
        ctx.lineTo(
          shape.points.end.x - head_length * Math.cos(angle - Math.PI / 6),
          shape.points.end.y - head_length * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(shape.points.end.x, shape.points.end.y);
        ctx.lineTo(
          shape.points.end.x - head_length * Math.cos(angle + Math.PI / 6),
          shape.points.end.y - head_length * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
        break;
      }
      case "text": {
        ctx.font = `${shape.font.font_size}px Cursive`;
        ctx.fillText(shape.text, shape.points.start.x, shape.points.start.y);
        break;
      }
      case "diamond": {
        // find center of straight line forming from starting and ending coordinates
        const center = shape.center;

        // calculate width & height
        const width = shape.width;
        const height = shape.height;

        // drawing all the four vertices from the center
        ctx.beginPath();
        ctx.moveTo(center.x, center.y - height);
        ctx.lineTo(center.x + width, center.y);
        ctx.lineTo(center.x, center.y + height);
        ctx.lineTo(center.x - width, center.y);
        ctx.closePath();
        ctx.stroke();
        break;
      }
    }
  });
}
