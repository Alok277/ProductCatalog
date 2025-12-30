'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

// Import venn.js - it's a CommonJS module
const venn = require('venn.js')

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
    if (!ref.current || !data) return

    // Clear previous content
    d3.select(ref.current).selectAll('*').remove()

    // Map backend data to Venn sets
    // Focus on Group A (Event_1 and Event_2) as the main visualization
    // venn.js works best with 2-3 sets at a time
    const sets: any[] = []

    // Group A: Event_1 and Event_2 with their intersection
    // For venn.js, we need to provide individual sets and their intersection
    const event1Size = data['Event_1'] || 0
    const event2Size = data['Event_2'] || 0
    const intersectionSize = data['Event_1_AND_Event_2'] || 0

    // Calculate individual set sizes (excluding intersection)
    const event1Only = event1Size - intersectionSize
    const event2Only = event2Size - intersectionSize

    // Build sets array - venn.js needs all areas including intersections
    sets.push({ sets: ['Event_1'], size: event1Size })
    sets.push({ sets: ['Event_2'], size: event2Size })
    sets.push({ sets: ['Event_1', 'Event_2'], size: intersectionSize })

    // Validate sets before passing to venn
    if (sets.length === 0 || sets.some(s => !s.size && s.size !== 0)) {
      console.warn('No valid sets to visualize', sets)
      return
    }

    // Filter out sets with invalid sizes
    const validSets = sets.filter(s => s.size >= 0 && s.sets && Array.isArray(s.sets))
    
    if (validSets.length === 0) {
      console.warn('No valid sets after filtering')
      return
    }

    // Create Venn diagram
    const chart = venn.VennDiagram()
      .width(800)
      .height(600)
      .padding(20)

    const svg = d3
      .select(ref.current)
      .append('svg')
      .attr('width', 800)
      .attr('height', 600)

    try {
      // VennDiagram calculates layout internally, just pass the sets array
      // The sets array should include all individual sets and intersections
      console.log('Passing sets to VennDiagram:', validSets)
      svg.datum(validSets).call(chart)
      
      // Get the solution for debugging/display purposes
      const solution = venn.venn(validSets, {})
      console.log('Solution from venn.venn():', solution)
    } catch (error) {
      console.error('Error calculating venn diagram:', error)
      // Fallback: show error message
      svg.append('text')
        .attr('x', 400)
        .attr('y', 300)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('fill', 'red')
        .text('Error rendering Venn diagram')
      return
    }

    // Wait for chart to render, then add styling and tooltips
    setTimeout(() => {
      // Add interactive tooltips and styling to circles
      svg
        .selectAll('g')
        .selectAll('path')
        .style('fill-opacity', 0.3)
        .style('stroke-width', 2)
        .style('stroke', '#333')
        .style('cursor', 'pointer')
        .on('mouseover', function (event: MouseEvent, d: any) {
          d3.select(this).style('fill-opacity', 0.6)
          
          // Find the corresponding data for this path
          const data = d3.select(this.parentNode).datum() as any
          if (data) {
            const setsLabel = Array.isArray(data.sets) ? data.sets.join(' ∩ ') : data.sets
            const tooltipText = `${setsLabel}: ${data.size?.toLocaleString() || 'N/A'} users`
            
            const rect = ref.current?.getBoundingClientRect()
            setTooltip({ 
              x: (rect?.left || 0) + event.offsetX + 20, 
              y: (rect?.top || 0) + event.offsetY + 20, 
              text: tooltipText 
            })
          }
        })
        .on('mouseout', function () {
          d3.select(this).style('fill-opacity', 0.3)
          setTooltip(null)
        })

      // Style labels
      svg
        .selectAll('text')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .style('pointer-events', 'none')
    }, 100)

    return () => {
      d3.select(ref.current).selectAll('*').remove()
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

