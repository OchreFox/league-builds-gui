import SVG from '@svgdotjs/svg.js'

// The task is to find the points between which the SVG can be resized while maintaining the aspect ratio while
// adjusting to the parent container's width.
// In the example above, the SVG is resized to 200% while maintaining the aspect ratio.
// The points that change in value in the X coordinate must be dynamically calculated according to the width prop.

// Create an SVG component that can be used as a button with the following SVG code:
// <!-- Original -->
{
  /* <svg id="a" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135.66 62">
    <polygon points="109.83 8 132.83 31 109.83 54 92.83 54 25.83 54 2.83 31 25.83 8 109.83 8"
        fill="#0f1128" stroke="#5d481d" stroke-width="4" />
    <polyline points="5.83 28 13.83 28 40.83 1 94.83 1 121.83 28 129.83 28" fill="none"
        stroke="#5d481d" stroke-width="2" />
    <polyline points="129.83 34 121.83 34 94.83 61 40.83 61 13.83 34 5.83 34" fill="none"
        stroke="#5d481d" stroke-width="2" />
</svg> */
}

// <!-- Resized with constraints (200% width) -->
{
  /* <svg id="a" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 265.66 62">
    <polygon points="239.83 8 262.83 31 239.83 54 222.83 54 25.83 54 2.83 31 25.83 8 239.83 8"
        fill="#0f1128" stroke="#5d481d" stroke-width="4" />
    <polyline points="5.83 28 13.83 28 40.83 1 224.83 1 251.83 28 259.83 28" fill="none"
        stroke="#5d481d" stroke-width="2" />
    <polyline points="259.83 34 251.83 34 224.83 61 40.83 61 13.83 34 5.83 34" fill="none"
        stroke="#5d481d" stroke-width="2" />
</svg> */
}

// Get the initial points as an array of points.
// The points are given as a string of numbers separated by spaces, with each pair of numbers representing a point.
const getArrayOfPoints = (points: string): Array<[number, number]> => {
  return points.split(' ').reduce((acc: Array<[number, number]>, point: string, index: number) => {
    if (index % 2 === 0) {
      acc.push([Number(point), Number(points.split(' ')[index + 1])])
    }
    return acc
  }, [])
}

const generateResponsiveSVG = (initialPoints: string, resizedPoints: string, width?: number) => {
  // Find the points that change in value in the X coordinate by pxDiff and replace them with a variable.

  const initialPointsArray: Array<[number, number]> = getArrayOfPoints(initialPoints)
  const resizedPointsArray: Array<[number, number]> = getArrayOfPoints(resizedPoints)
  const pointsToChange: Array<[number, number]> = initialPointsArray.filter(
    (point: [number, number], index: number) => {
      return point[0] !== resizedPointsArray[index][0]
    }
  )

  const delta = Math.abs(pointsToChange[0][0] - pointsToChange[1][0])
  console.log('delta', delta)

  console.log('pointsToChange', pointsToChange)

  // Calculate the width of the initial path

  const initialPoly = new SVG.PointArray(initialPoints)
  const initialWidth = width ?? initialPoly.bbox().width
  console.log('initialWidth', initialWidth)

  // Calculate the width of the resized path
  const resizedPoly = new SVG.PointArray(resizedPoints)
  const resizedWidth = resizedPoly.bbox().width
  console.log('resizedWidth', resizedWidth)

  // Calculate the ratio between the initial and resized width
  const ratio = resizedWidth / initialWidth
  console.log('ratio', ratio)

  // Convert each point to be relative to the initial width
  // e.g. 109.83 -> 130 - 109.83 = 20.17
  // template -> width - point = newPoint
  let relativePoints: Array<[any, number]> = []

  // Loop through the points and replace the X coordinate with the new value (if it is one of the points to change)
  for (const point of initialPointsArray) {
    // If the point is one of the points to change, replace it with the new value
    if (pointsToChange.some((changedPoint) => changedPoint === point)) {
      // Find the new value by subtracting the point from the width and multiplying by the ratio
      relativePoints.push([`\${width - ${(initialWidth - point[0]).toFixed(2)}}`, point[1]])
    } else {
      // If the point is not one of the points to change, push the original value
      relativePoints.push(point)
    }
  }

  console.log('relativePoints', relativePoints.toString().replace(/,/g, ' '))
}
