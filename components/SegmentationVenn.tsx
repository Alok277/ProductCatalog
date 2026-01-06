'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface SegmentationData {
  [key: string]: number
}

interface SegmentationVennProps {
  data: SegmentationData
  queryStructure?: any
}

export default function SegmentationVenn({ data, queryStructure }: SegmentationVennProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null)

  useEffect(() => {
    // Capture ref.current at the start of effect for cleanup
    const containerRef = ref.current
    if (!containerRef || !data) return

    // Clear previous content
    d3.select(containerRef).selectAll('*').remove()

    // Extract data for nested circles with intersection
    // Outer circle (Event_1) - larger set
    // Inner circle (Event_2) - subset inside Event_1
    // Intersecting circle (Event_3) - intersects with Event_2
    const outerSize = data['Event_1'] || 0
    const innerSize = data['Event_2'] || 0
    const intersectSize = data['Event_3'] || 0
    const intersectionSize = data['Event_2_AND_Event_3'] || 0 // Intersection of Event_2 and Event_3
    
    const outerOnly = outerSize - innerSize // Users in Event_1 but not in Event_2
    const innerOnly = innerSize - intersectionSize // Users in Event_2 but not in Event_3
    const intersectOnly = intersectSize - intersectionSize // Users in Event_3 but not in Event_2

    // Validate data
    if (outerSize === 0 && innerSize === 0 && intersectSize === 0) {
      console.warn('No data to visualize')
      return
    }

    // SVG dimensions
    const width = 800
    const height = 600
    const centerX = width / 2
    const centerY = height / 2

    // Calculate radii based on sizes (proportional scaling)
    // Use square root for area-based scaling
    const maxSize = Math.max(outerSize, innerSize, intersectSize, 1)
    const scaleFactor = Math.min(width, height) / 2 / Math.sqrt(maxSize) * 0.6

    const outerRadius = Math.sqrt(outerSize) * scaleFactor
    const innerRadius = Math.sqrt(innerSize) * scaleFactor
    const intersectRadius = Math.sqrt(intersectSize) * scaleFactor

    // Position Event_3 to intersect with Event_2
    // Calculate distance between centers for intersection
    // The distance should be less than the sum of radii for intersection
    const maxDistance = innerRadius + intersectRadius
    const minDistance = Math.abs(innerRadius - intersectRadius)
    // Calculate distance based on intersection size (proportional)
    const intersectionRatio = intersectionSize / Math.min(innerSize, intersectSize)
    const d = maxDistance - (maxDistance - minDistance) * intersectionRatio * 0.7
    const event3X = d * 0.7 // Offset to the right
    const event3Y = 0 // Same vertical position

    // Create SVG
    const svg = d3
      .select(containerRef)
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    // Create a group for the circles
    const g = svg.append('g').attr('transform', `translate(${centerX}, ${centerY})`)

    // Draw outer circle (Event_1) - draw first so it's behind everything
    const outerCircle = g
      .append('circle')
      .attr('r', outerRadius)
      .attr('cx', 0)
      .attr('cy', 0)
      .style('fill', '#3B82F6') // Blue
      .style('fill-opacity', 0.25)
      .style('stroke', '#1E40AF')
      .style('stroke-width', 3)
      .style('cursor', 'pointer')
      .on('mouseover', function (event: MouseEvent) {
        d3.select(this).style('fill-opacity', 0.4)
        const rect = containerRef?.getBoundingClientRect()
        setTooltip({
          x: (rect?.left || 0) + event.offsetX + 20,
          y: (rect?.top || 0) + event.offsetY + 20,
          text: `Event_1: ${outerSize.toLocaleString()} users (outer circle)`
        })
      })
      .on('mouseout', function () {
        d3.select(this).style('fill-opacity', 0.25)
        setTooltip(null)
      })

    // Draw Event_3 circle (intersecting with Event_2) - draw before Event_2 so intersection is visible
    const event3Circle = g
      .append('circle')
      .attr('r', intersectRadius)
      .attr('cx', event3X)
      .attr('cy', event3Y)
      .style('fill', '#F59E0B') // Amber/Orange
      .style('fill-opacity', 0.4)
      .style('stroke', '#D97706')
      .style('stroke-width', 3)
      .style('cursor', 'pointer')
      .on('mouseover', function (event: MouseEvent) {
        d3.select(this).style('fill-opacity', 0.6)
        const rect = containerRef?.getBoundingClientRect()
        setTooltip({
          x: (rect?.left || 0) + event.offsetX + 20,
          y: (rect?.top || 0) + event.offsetY + 20,
          text: `Event_3: ${intersectSize.toLocaleString()} users (intersects with Event_2)`
        })
      })
      .on('mouseout', function () {
        d3.select(this).style('fill-opacity', 0.4)
        setTooltip(null)
      })

    // Draw inner circle (Event_2) - nested inside Event_1, intersects with Event_3
    const innerCircle = g
      .append('circle')
      .attr('r', innerRadius)
      .attr('cx', 0)
      .attr('cy', 0)
      .style('fill', '#10B981') // Green
      .style('fill-opacity', 0.5)
      .style('stroke', '#059669')
      .style('stroke-width', 3)
      .style('cursor', 'pointer')
      .on('mouseover', function (event: MouseEvent) {
        d3.select(this).style('fill-opacity', 0.7)
        const rect = containerRef?.getBoundingClientRect()
        setTooltip({
          x: (rect?.left || 0) + event.offsetX + 20,
          y: (rect?.top || 0) + event.offsetY + 20,
          text: `Event_2: ${innerSize.toLocaleString()} users (nested in Event_1, intersects with Event_3)`
        })
      })
      .on('mouseout', function () {
        d3.select(this).style('fill-opacity', 0.5)
        setTooltip(null)
      })

    // Draw intersection area between Event_2 and Event_3
    // Create a visual representation of the intersection area
    if (intersectionSize > 0) {
      // Calculate intersection circle size based on intersection data
      const intersectionRadius = Math.sqrt(intersectionSize) * scaleFactor * 0.9
      
      // Position intersection circle in the overlapping area
      const intersectionX = event3X * 0.35
      const intersectionY = 0
      
      // Create intersection circle (overlapping area)
      const intersectionCircle = g
        .append('circle')
        .attr('r', intersectionRadius)
        .attr('cx', intersectionX)
        .attr('cy', intersectionY)
        .style('fill', '#8B5CF6') // Purple for intersection
        .style('fill-opacity', 0.7)
        .style('stroke', '#6D28D9')
        .style('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseover', function (event: MouseEvent) {
          d3.select(this).style('fill-opacity', 0.9)
          const rect = containerRef?.getBoundingClientRect()
          setTooltip({
            x: (rect?.left || 0) + event.offsetX + 20,
            y: (rect?.top || 0) + event.offsetY + 20,
            text: `Event_2 ∩ Event_3: ${intersectionSize.toLocaleString()} users (intersection)`
          })
        })
        .on('mouseout', function () {
          d3.select(this).style('fill-opacity', 0.7)
          setTooltip(null)
        })
    }

    // Add labels
    // Outer circle label (positioned outside the circle)
    g.append('text')
      .attr('x', 0)
      .attr('y', -outerRadius - 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#1E40AF')
      .text(`Event_1: ${outerSize.toLocaleString()}`)

    // Inner circle label (positioned at center-left)
    g.append('text')
      .attr('x', -innerRadius * 0.3)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#059669')
      .text(`Event_2: ${innerSize.toLocaleString()}`)

    // Event_3 label (positioned outside the circle)
    g.append('text')
      .attr('x', event3X)
      .attr('y', -intersectRadius - 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#D97706')
      .text(`Event_3: ${intersectSize.toLocaleString()}`)

    // Intersection label (positioned in the intersection area)
    if (intersectionSize > 0) {
      g.append('text')
        .attr('x', event3X * 0.3)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', '#6D28D9')
        .text(`∩: ${intersectionSize.toLocaleString()}`)
    }

    // Add annotation for outer-only area
    if (outerOnly > 0) {
      g.append('text')
        .attr('x', outerRadius * 0.6)
        .attr('y', -outerRadius * 0.3)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#6B7280')
        .style('font-style', 'italic')
        .text(`Only Event_1: ${outerOnly.toLocaleString()}`)
    }
    
    return () => {
      // Use captured ref value in cleanup
      if (containerRef) {
        d3.select(containerRef).selectAll('*').remove()
      }
    }
  }, [data])

  return (
    <div className="relative w-full flex justify-center">
      <div ref={ref} className="venn-container" />
      {tooltip && (
        <div
          className="absolute bg-black text-white px-3 py-2 rounded shadow-lg z-50 pointer-events-none text-sm"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}

