"use client";
import { useState, useEffect, useRef } from "react";
import { SiGoogleclassroom } from "react-icons/si";
import { VscCircleLargeFilled } from "react-icons/vsc";
import { RiCheckboxBlankFill } from "react-icons/ri";
import { FaArrowRightLong } from "react-icons/fa6";
import { BsChatTextFill } from "react-icons/bs";
import { BiSolidPencil } from "react-icons/bi";
import { BsCursorFill, BsEraserFill } from "react-icons/bs";
import CheckUserAuth from "@/wrappers/check-user-auth";
import BtnDrawCanvas from "../canvas/btn-draw-canvas";
import DrawCanvas from "../canvas/draw-canvas";
import mouse_move_draw_canvas from "../canvas/mouse-move-draw-canvas";
import fix_dpi from "../canvas/fix_dpi";
import { Card, Heading, Loading, Modal } from "@repo/ui/index";
import { success_notification, error_notification } from "@/utils/toast.utils";

//     9     10    11    12
//  9  ┌─────┬─────┬─────┬─────┐
//     │     │     │     │     │
//  10 ├─────┼─────┼─────┼─────┤
//     │     │  ?  │     │     │  ← always draw +(.5) more to avoid line stroke to let's say 1px to go to multiple lines
//  11 ├─────┼─────┼─────┼─────┤
//     │     │     │     │     │
//  12 └─────┴─────┴─────┴─────┘
//           ↑
//       x = 10 coordinate

interface Geometry {
  type: "BOX" | "CIRCLE";
}

const BTNS_CANVAS = [
  { id: "cursor", icon: <BsCursorFill className="w-full h-full" /> },
  { id: "circle", icon: <VscCircleLargeFilled className="w-full h-full" /> },
  { id: "box", icon: <RiCheckboxBlankFill className="w-full h-full" /> },
  { id: "arrow", icon: <FaArrowRightLong className="w-full h-full" /> },
  { id: "text", icon: <BsChatTextFill className="w-full h-full" /> },
  { id: "diamond", icon: <BiSolidPencil className="w-full h-full" /> },
  { id: "eraser", icon: <BsEraserFill className="w-full h-full" /> },
];

export default function Draw() {
  // canvas-btn related states
  const [selected_btn_id, set_selected_btn_id] = useState<string | null>(null);
  const [text_input_modal, set_text_input_modal] = useState({
    is_open: false,
    text: "",
  });
  return (
    <div
      id="rooms"
      className={`color-base-100 color-base-content shrink-0 min-h-[65vh] flex flex-col justify-center items-center gap-2 sm:gap-3 bg-linear-to-b to-blue-500 overflow-hidden p-3 sm:p-5 md:p-7`}
    >
      {/* <CheckUserAuth> */}
      {/* heading of page */}
      <div className="flex justify-center items-center gap-2">
        <Heading size="h3" text="Whiteboard" class_name="underline" />
        <SiGoogleclassroom className="inline-block w-9 h-auto" />
      </div>
      {/* functionality btns of draw-canvas */}
      <section className={`relative shrink-0 w-full ${selected_btn_id !== "cursor" && "cursor-crosshair"}`}>
        <div
          id="btns-draw-canvas"
          className="color-base-300 color-base-content absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 shrink-0 w-full max-w-[90%] sm:max-w-lg md:max-w-xl h-auto flex justify-center items-center gap-5 sm:gap-7 md:gap-9 lg:gap-11 rounded-full overflow-hidden p-1 sm:p-1.5"
        >
          {/* mapping all the btns of BTN_CANVAS */}
          {BTNS_CANVAS.map((btn) => (
            <BtnDrawCanvas
              id={btn.id}
              selected_btn_id={selected_btn_id}
              icon={btn.icon}
              on_click={() => set_selected_btn_id(btn.id)}
            />
          ))}
        </div>
        {/* draw canvas whiteboard */}
        <DrawCanvas selected_btn_id={selected_btn_id} />
      </section>
      {/* Live logs */}
      <div className="shrink-0 color-warning color-warning-content min-h-[25vh] w-full flex flex-col justify-start items-center gap-2 rounded-xl p-1 sm:p-2 md:p-3">
        <Heading size="h3" text="Live logs" class_name="underline" />
      </div>
      {/* </CheckUserAuth> */}
    </div>
  );
}

// "use client"

// import type React from "react"

// import { useRef, useState, useEffect, useCallback } from "react"
// import type { Tool, Element, Point } from "@/types/whiteboard"

// interface CanvasProps {
//   tool: Tool
//   elements: Element[]
//   setElements: (elements: Element[]) => void
//   selectedElement: Element | null
//   setSelectedElement: (element: Element | null) => void
//   strokeColor: string
//   fillColor: string
//   strokeWidth: number
//   saveToHistory: (elements: Element[]) => void
// }

// export function Canvas({
//   tool,
//   elements,
//   setElements,
//   selectedElement,
//   setSelectedElement,
//   strokeColor,
//   fillColor,
//   strokeWidth,
//   saveToHistory,
// }: CanvasProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const textInputRef = useRef<HTMLInputElement>(null)
//   const [isDrawing, setIsDrawing] = useState(false)
//   const [currentElement, setCurrentElement] = useState<Element | null>(null)
//   const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
//   const [scale, setScale] = useState(1)
//   const [isPanning, setIsPanning] = useState(false)
//   const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null)
//   const [textInput, setTextInput] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false })
//   const [textValue, setTextValue] = useState("")

//   const getMousePos = useCallback(
//     (e: React.MouseEvent<HTMLCanvasElement>): Point => {
//       const canvas = canvasRef.current
//       if (!canvas) return { x: 0, y: 0 }
//       const rect = canvas.getBoundingClientRect()
//       return {
//         x: (e.clientX - rect.left - panOffset.x) / scale,
//         y: (e.clientY - rect.top - panOffset.y) / scale,
//       }
//     },
//     [panOffset, scale],
//   )

//   const createElement = (x: number, y: number): Element => {
//     const id = Date.now().toString()
//     const baseElement = {
//       id,
//       strokeColor,
//       fillColor,
//       strokeWidth,
//     }

//     switch (tool) {
//       case "pencil":
//         return { ...baseElement, type: "pencil", points: [{ x, y }] }
//       case "line":
//         return { ...baseElement, type: "line", x1: x, y1: y, x2: x, y2: y }
//       case "arrow":
//         return { ...baseElement, type: "arrow", x1: x, y1: y, x2: x, y2: y }
//       case "rectangle":
//         return { ...baseElement, type: "rectangle", x, y, width: 0, height: 0 }
//       case "ellipse":
//         return { ...baseElement, type: "ellipse", x, y, width: 0, height: 0 }
//       case "diamond":
//         return { ...baseElement, type: "diamond", x, y, width: 0, height: 0 }
//       case "text":
//         return { ...baseElement, type: "text", x, y, text: "" }
//       default:
//         return { ...baseElement, type: "pencil", points: [{ x, y }] }
//     }
//   }

//   const updateElement = (element: Element, x: number, y: number): Element => {
//     switch (element.type) {
//       case "pencil":
//         return { ...element, points: [...element.points, { x, y }] }
//       case "line":
//       case "arrow":
//         return { ...element, x2: x, y2: y }
//       case "rectangle":
//       case "ellipse":
//       case "diamond":
//         return {
//           ...element,
//           width: x - element.x,
//           height: y - element.y,
//         }
//       default:
//         return element
//     }
//   }

//   const isPointInElement = (point: Point, element: Element): boolean => {
//     const margin = 5
//     switch (element.type) {
//       case "rectangle":
//       case "diamond": {
//         const minX = Math.min(element.x, element.x + element.width)
//         const maxX = Math.max(element.x, element.x + element.width)
//         const minY = Math.min(element.y, element.y + element.height)
//         const maxY = Math.max(element.y, element.y + element.height)
//         return (
//           point.x >= minX - margin && point.x <= maxX + margin && point.y >= minY - margin && point.y <= maxY + margin
//         )
//       }
//       case "ellipse": {
//         const cx = element.x + element.width / 2
//         const cy = element.y + element.height / 2
//         const rx = Math.abs(element.width / 2) + margin
//         const ry = Math.abs(element.height / 2) + margin
//         return Math.pow((point.x - cx) / rx, 2) + Math.pow((point.y - cy) / ry, 2) <= 1
//       }
//       case "line":
//       case "arrow": {
//         const dist = distanceToLine(point, { x: element.x1, y: element.y1 }, { x: element.x2, y: element.y2 })
//         return dist <= margin + element.strokeWidth
//       }
//       case "pencil": {
//         for (let i = 0; i < element.points.length - 1; i++) {
//           const dist = distanceToLine(point, element.points[i], element.points[i + 1])
//           if (dist <= margin + element.strokeWidth) return true
//         }
//         return false
//       }
//       case "text": {
//         const ctx = canvasRef.current?.getContext("2d")
//         if (!ctx) return false
//         ctx.font = `${16}px sans-serif`
//         const metrics = ctx.measureText(element.text)
//         return (
//           point.x >= element.x - margin &&
//           point.x <= element.x + metrics.width + margin &&
//           point.y >= element.y - 16 - margin &&
//           point.y <= element.y + margin
//         )
//       }
//       default:
//         return false
//     }
//   }

//   const distanceToLine = (point: Point, start: Point, end: Point): number => {
//     const A = point.x - start.x
//     const B = point.y - start.y
//     const C = end.x - start.x
//     const D = end.y - start.y
//     const dot = A * C + B * D
//     const lenSq = C * C + D * D
//     let param = -1
//     if (lenSq !== 0) param = dot / lenSq
//     let xx, yy
//     if (param < 0) {
//       xx = start.x
//       yy = start.y
//     } else if (param > 1) {
//       xx = end.x
//       yy = end.y
//     } else {
//       xx = start.x + param * C
//       yy = start.y + param * D
//     }
//     const dx = point.x - xx
//     const dy = point.y - yy
//     return Math.sqrt(dx * dx + dy * dy)
//   }

//   const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (e.button === 1 || (e.button === 0 && e.altKey)) {
//       setIsPanning(true)
//       setLastPanPoint({ x: e.clientX, y: e.clientY })
//       return
//     }

//     const pos = getMousePos(e)

//     if (tool === "select") {
//       const clickedElement = [...elements].reverse().find((el) => isPointInElement(pos, el))
//       setSelectedElement(clickedElement || null)
//       return
//     }

//     if (tool === "text") {
//       const canvas = canvasRef.current
//       if (!canvas) return
//       const rect = canvas.getBoundingClientRect()
//       setTextInput({
//         x: e.clientX - rect.left,
//         y: e.clientY - rect.top,
//         visible: true,
//       })
//       setTextValue("")
//       setTimeout(() => textInputRef.current?.focus(), 0)
//       return
//     }

//     setIsDrawing(true)
//     const element = createElement(pos.x, pos.y)
//     setCurrentElement(element)
//     setSelectedElement(null)
//   }

//   const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (isPanning && lastPanPoint) {
//       const dx = e.clientX - lastPanPoint.x
//       const dy = e.clientY - lastPanPoint.y
//       setPanOffset({ x: panOffset.x + dx, y: panOffset.y + dy })
//       setLastPanPoint({ x: e.clientX, y: e.clientY })
//       return
//     }

//     if (!isDrawing || !currentElement) return
//     const pos = getMousePos(e)
//     const updated = updateElement(currentElement, pos.x, pos.y)
//     setCurrentElement(updated)
//   }

//   const handleMouseUp = () => {
//     if (isPanning) {
//       setIsPanning(false)
//       setLastPanPoint(null)
//       return
//     }

//     if (isDrawing && currentElement) {
//       const newElements = [...elements, currentElement]
//       setElements(newElements)
//       saveToHistory(newElements)
//       setCurrentElement(null)
//     }
//     setIsDrawing(false)
//   }

//   const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
//     if (e.ctrlKey || e.metaKey) {
//       e.preventDefault()
//       const delta = -e.deltaY / 500
//       const newScale = Math.max(0.1, Math.min(5, scale + delta))
//       setScale(newScale)
//     } else {
//       setPanOffset({
//         x: panOffset.x - e.deltaX,
//         y: panOffset.y - e.deltaY,
//       })
//     }
//   }

//   const handleTextSubmit = () => {
//     if (textValue.trim()) {
//       const pos = {
//         x: (textInput.x - panOffset.x) / scale,
//         y: (textInput.y - panOffset.y) / scale,
//       }
//       const textElement: Element = {
//         id: Date.now().toString(),
//         type: "text",
//         x: pos.x,
//         y: pos.y,
//         text: textValue,
//         strokeColor,
//         fillColor,
//         strokeWidth,
//       }
//       const newElements = [...elements, textElement]
//       setElements(newElements)
//       saveToHistory(newElements)
//     }
//     setTextInput({ ...textInput, visible: false })
//     setTextValue("")
//   }

//   const drawElement = useCallback((ctx: CanvasRenderingContext2D, element: Element, isSelected: boolean) => {
//     ctx.strokeStyle = element.strokeColor
//     ctx.fillStyle = element.fillColor
//     ctx.lineWidth = element.strokeWidth
//     ctx.lineCap = "round"
//     ctx.lineJoin = "round"

//     switch (element.type) {
//       case "pencil":
//         if (element.points.length < 2) return
//         ctx.beginPath()
//         ctx.moveTo(element.points[0].x, element.points[0].y)
//         for (let i = 1; i < element.points.length; i++) {
//           ctx.lineTo(element.points[i].x, element.points[i].y)
//         }
//         ctx.stroke()
//         break

//       case "line":
//         ctx.beginPath()
//         ctx.moveTo(element.x1, element.y1)
//         ctx.lineTo(element.x2, element.y2)
//         ctx.stroke()
//         break

//       case "arrow":
//         ctx.beginPath()
//         ctx.moveTo(element.x1, element.y1)
//         ctx.lineTo(element.x2, element.y2)
//         ctx.stroke()
//         // Draw arrowhead
//         const angle = Math.atan2(element.y2 - element.y1, element.x2 - element.x1)
//         const headLength = 15
//         ctx.beginPath()
//         ctx.moveTo(element.x2, element.y2)
//         ctx.lineTo(
//           element.x2 - headLength * Math.cos(angle - Math.PI / 6),
//           element.y2 - headLength * Math.sin(angle - Math.PI / 6),
//         )
//         ctx.moveTo(element.x2, element.y2)
//         ctx.lineTo(
//           element.x2 - headLength * Math.cos(angle + Math.PI / 6),
//           element.y2 - headLength * Math.sin(angle + Math.PI / 6),
//         )
//         ctx.stroke()
//         break

//       case "rectangle":
//         ctx.beginPath()
//         ctx.rect(element.x, element.y, element.width, element.height)
//         if (element.fillColor !== "transparent") ctx.fill()
//         ctx.stroke()
//         break

//       case "ellipse":
//         ctx.beginPath()
//         ctx.ellipse(
//           element.x + element.width / 2,
//           element.y + element.height / 2,
//           Math.abs(element.width / 2),
//           Math.abs(element.height / 2),
//           0,
//           0,
//           Math.PI * 2,
//         )
//         if (element.fillColor !== "transparent") ctx.fill()
//         ctx.stroke()
//         break

//       case "diamond":
//         const cx = element.x + element.width / 2
//         const cy = element.y + element.height / 2
//         ctx.beginPath()
//         ctx.moveTo(cx, element.y)
//         ctx.lineTo(element.x + element.width, cy)
//         ctx.lineTo(cx, element.y + element.height)
//         ctx.lineTo(element.x, cy)
//         ctx.closePath()
//         if (element.fillColor !== "transparent") ctx.fill()
//         ctx.stroke()
//         break

//       case "text":
//         ctx.font = `16px sans-serif`
//         ctx.fillStyle = element.strokeColor
//         ctx.fillText(element.text, element.x, element.y)
//         break
//     }

//     // Draw selection box
//     if (isSelected) {
//       ctx.strokeStyle = "#4f8cff"
//       ctx.lineWidth = 1
//       ctx.setLineDash([5, 5])
//       const bounds = getElementBounds(element)
//       ctx.strokeRect(bounds.x - 5, bounds.y - 5, bounds.width + 10, bounds.height + 10)
//       ctx.setLineDash([])
//     }
//   }, [])

//   const getElementBounds = (element: Element) => {
//     switch (element.type) {
//       case "pencil": {
//         const xs = element.points.map((p) => p.x)
//         const ys = element.points.map((p) => p.y)
//         const minX = Math.min(...xs)
//         const minY = Math.min(...ys)
//         return {
//           x: minX,
//           y: minY,
//           width: Math.max(...xs) - minX,
//           height: Math.max(...ys) - minY,
//         }
//       }
//       case "line":
//       case "arrow":
//         return {
//           x: Math.min(element.x1, element.x2),
//           y: Math.min(element.y1, element.y2),
//           width: Math.abs(element.x2 - element.x1),
//           height: Math.abs(element.y2 - element.y1),
//         }
//       case "rectangle":
//       case "ellipse":
//       case "diamond":
//         return {
//           x: Math.min(element.x, element.x + element.width),
//           y: Math.min(element.y, element.y + element.height),
//           width: Math.abs(element.width),
//           height: Math.abs(element.height),
//         }
//       case "text":
//         return { x: element.x, y: element.y - 16, width: 100, height: 20 }
//       default:
//         return { x: 0, y: 0, width: 0, height: 0 }
//     }
//   }

//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     const resize = () => {
//       canvas.width = canvas.offsetWidth
//       canvas.height = canvas.offsetHeight
//     }
//     resize()
//     window.addEventListener("resize", resize)

//     return () => window.removeEventListener("resize", resize)
//   }, [])

//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     // Clear canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height)

//     // Draw grid pattern
//     ctx.save()
//     ctx.translate(panOffset.x, panOffset.y)
//     ctx.scale(scale, scale)

//     const gridSize = 20
//     const startX = Math.floor(-panOffset.x / scale / gridSize) * gridSize
//     const startY = Math.floor(-panOffset.y / scale / gridSize) * gridSize
//     const endX = startX + canvas.width / scale + gridSize * 2
//     const endY = startY + canvas.height / scale + gridSize * 2

//     ctx.strokeStyle = "#e5e5e5"
//     ctx.lineWidth = 0.5
//     for (let x = startX; x < endX; x += gridSize) {
//       ctx.beginPath()
//       ctx.moveTo(x, startY)
//       ctx.lineTo(x, endY)
//       ctx.stroke()
//     }
//     for (let y = startY; y < endY; y += gridSize) {
//       ctx.beginPath()
//       ctx.moveTo(startX, y)
//       ctx.lineTo(endX, y)
//       ctx.stroke()
//     }

//     // Draw all elements
//     elements.forEach((element) => {
//       drawElement(ctx, element, selectedElement?.id === element.id)
//     })

//     // Draw current element being created
//     if (currentElement) {
//       drawElement(ctx, currentElement, false)
//     }

//     ctx.restore()
//   }, [elements, currentElement, panOffset, scale, selectedElement, drawElement])

//   return (
//     <div className="w-full h-full relative">
//       <canvas
//         ref={canvasRef}
//         className="w-full h-full cursor-crosshair"
//         style={{
//           cursor: tool === "select" ? "default" : isPanning ? "grabbing" : "crosshair",
//         }}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onMouseLeave={handleMouseUp}
//         onWheel={handleWheel}
//       />
//       {textInput.visible && (
//         <input
//           ref={textInputRef}
//           type="text"
//           value={textValue}
//           onChange={(e) => setTextValue(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleTextSubmit()
//             if (e.key === "Escape") setTextInput({ ...textInput, visible: false })
//           }}
//           onBlur={handleTextSubmit}
//           className="absolute bg-transparent border-none outline-none text-foreground text-base"
//           style={{
//             left: textInput.x,
//             top: textInput.y - 10,
//             minWidth: "100px",
//           }}
//           placeholder="Type here..."
//         />
//       )}
//       <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground">
//         <button onClick={() => setScale(Math.max(0.1, scale - 0.1))} className="hover:text-foreground">
//           −
//         </button>
//         <span className="min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
//         <button onClick={() => setScale(Math.min(5, scale + 0.1))} className="hover:text-foreground">
//           +
//         </button>
//         <button
//           onClick={() => {
//             setScale(1)
//             setPanOffset({ x: 0, y: 0 })
//           }}
//           className="ml-2 hover:text-foreground"
//         >
//           Reset
//         </button>
//       </div>
//     </div>
//   )
// }
