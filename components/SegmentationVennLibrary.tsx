"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// Import venn.js - it's a CommonJS module
const venn = require("venn.js");

interface SegmentationData {
  [key: string]: number;
}

interface SegmentationVennLibraryProps {
  data: SegmentationData;
  queryStructure?: any;
  width?: number;
  height?: number;
}

/**
 * Advanced Venn Diagram component using venn.js library
 * Handles complex multi-set Venn diagrams automatically
 * Supports up to 6 sets with automatic layout calculation
 */
export default function SegmentationVennLibrary({
  data,
  queryStructure,
  width = 800,
  height = 600,
}: SegmentationVennLibraryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  useEffect(() => {
    // Capture ref.current at the start of effect for cleanup
    const containerRef = ref.current;
    if (!containerRef || !data) return;

    // Clear previous content
    d3.select(containerRef).selectAll("*").remove();

    // Convert data to venn.js format
    // venn.js expects an array of objects with 'sets' and 'size' properties
    const sets: any[] = [];

    // Extract all unique event names from data keys
    const eventNames = new Set<string>();
    Object.keys(data).forEach((key) => {
      if (key.includes("_AND_")) {
        // Handle intersections like "Event_1_AND_Event_2"
        const events = key.split("_AND_");
        events.forEach((e) => eventNames.add(e.trim()));
      } else {
        // Handle single events
        eventNames.add(key);
      }
    });

    // For venn.js, we need to handle nested relationships
    // If Event_2 is nested in Event_1 but no intersection is defined,
    // we need to infer it or adjust the data

    // Check for nested relationships and add missing intersections
    const processedData = { ...data };
    Array.from(eventNames).forEach((eventName1) => {
      Array.from(eventNames).forEach((eventName2) => {
        if (eventName1 !== eventName2) {
          const intersectionKey = `${eventName1}_AND_${eventName2}`;
          const reverseKey = `${eventName2}_AND_${eventName1}`;

          // If intersection doesn't exist, check if we can infer it
          if (!processedData[intersectionKey] && !processedData[reverseKey]) {
            const size1 = processedData[eventName1] || 0;
            const size2 = processedData[eventName2] || 0;

            // If one set is smaller and could be nested, set intersection to the smaller size
            // This handles the nested case where Event_2 is inside Event_1
            if (size2 <= size1 && size2 > 0) {
              // Event_2 might be nested in Event_1
              processedData[intersectionKey] = size2;
            } else if (size1 <= size2 && size1 > 0) {
              // Event_1 might be nested in Event_2
              processedData[reverseKey] = size1;
            }
          }
        }
      });
    });

      // Create sets for individual events
      Array.from(eventNames).forEach((eventName) => {
        const size = processedData[eventName];
        if (size !== undefined && size > 0) {
          sets.push({
            sets: [eventName],
            size: size,
          });
        }
      });

      // Create sets for intersections
      Object.keys(processedData).forEach((key) => {
        if (key.includes("_AND_")) {
          const events = key.split("_AND_").map((e) => e.trim());
          const size = processedData[key];
          if (
            events.length >= 2 &&
            events.length <= 3 &&
            size !== undefined &&
            size > 0
          ) {
            // venn.js works best with 2-3 set intersections
            sets.push({
              sets: events,
              size: size,
            });
          }
        }
      });

      // Validate and fix set relationships
      // venn.js requires that intersection sizes don't exceed individual set sizes
      const validSets = sets
        .map((s) => {
          if (!s || !s.sets || !Array.isArray(s.sets)) {
            return null; // Invalid set structure
          }

          if (s.sets.length === 1) {
            // Individual sets are always valid if they have a size
            if (s.size === undefined || s.size < 0) {
              return null;
            }
            return s;
          }

          // For intersections, check if size is valid
          const intersectionSize = s.size || 0;
          
          // Get individual set sizes from processedData
          const individualSizes = s.sets
            .map((setName: string) => processedData[setName] || 0)
            .filter((size: number) => size > 0);

          if (individualSizes.length === 0) {
            return null; // No valid individual sets found
          }

          const minSetSize = Math.min(...individualSizes);

          // If intersection is larger than any individual set, cap it
          if (intersectionSize > minSetSize) {
            console.warn(
              `Intersection size ${intersectionSize} exceeds minimum set size ${minSetSize}, capping it`
            );
            return { ...s, size: minSetSize };
          }

          return s;
        })
        .filter(
          (s) =>
            s !== null &&
            s.size !== undefined &&
            s.size >= 0 &&
            s.sets &&
            Array.isArray(s.sets) &&
            s.sets.length > 0 &&
            s.sets.length <= 3 // venn.js works best with up to 3 sets per intersection
        ) as any[];

    if (validSets.length === 0) {
      console.warn("No valid sets to visualize", sets);
      return;
    }

    // Log the sets for debugging
    console.log("Venn.js sets:", validSets);

    // Create Venn diagram using venn.js
    const chart = venn.VennDiagram().width(width).height(height).padding(20);

    const svg = d3
      .select(containerRef)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    try {
      // Validate that venn.js can solve this layout
      // venn.js needs at least 2 sets to work
      if (validSets.filter((s) => s.sets.length === 1).length < 2) {
        throw new Error("Need at least 2 individual sets for Venn diagram");
      }

        // Try to solve the layout first
        const solution = venn.venn(validSets);
        if (!solution || Object.keys(solution).length === 0) {
          throw new Error(
            "Cannot solve Venn diagram layout - invalid set relationships"
          );
        }

        console.log("Venn.js solution:", solution);
        console.log("Valid sets passed to venn.js:", validSets);

        // venn.js automatically calculates optimal layout
        // Ensure validSets is properly formatted
        const formattedSets = validSets.map((s) => ({
          sets: s.sets,
          size: s.size || 0,
        }));

        svg.datum(formattedSets).call(chart);

      // Add interactive tooltips and styling
      svg
        .selectAll("g")
        .selectAll("path")
        .style("fill-opacity", 0.3)
        .style("stroke-width", 2)
        .style("stroke", "#333")
        .style("cursor", "pointer")
        .on("mouseover", function (event: MouseEvent, d: any) {
          d3.select(this).style("fill-opacity", 0.6);

          const element = this as Element;
          const parent = element.parentNode;
          if (parent && parent instanceof Element) {
            const data = d3.select(parent).datum() as any;
            if (data) {
              const setsLabel = Array.isArray(data.sets)
                ? data.sets.join(" ∩ ")
                : data.sets;
              const tooltipText = `${setsLabel}: ${
                data.size?.toLocaleString() || "N/A"
              } users`;

              const rect = containerRef?.getBoundingClientRect();
              setTooltip({
                x: (rect?.left || 0) + event.offsetX + 20,
                y: (rect?.top || 0) + event.offsetY + 20,
                text: tooltipText,
              });
            }
          }
        })
        .on("mouseout", function () {
          d3.select(this).style("fill-opacity", 0.3);
          setTooltip(null);
        });

      // Style labels
      svg
        .selectAll("text")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .style("pointer-events", "none");

      // Add custom colors for different sets
      const colors = [
        "#3B82F6", // Blue
        "#10B981", // Green
        "#F59E0B", // Amber
        "#8B5CF6", // Purple
        "#EF4444", // Red
        "#06B6D4", // Cyan
      ];

      svg.selectAll("g").each(function (d: any, i: number) {
        if (d && d.sets && Array.isArray(d.sets)) {
          const setIndex = Array.from(eventNames).indexOf(d.sets[0]);
          if (setIndex >= 0 && setIndex < colors.length) {
            d3.select(this)
              .selectAll("path")
              .style("fill", colors[setIndex % colors.length]);
          }
        }
      });
    } catch (error) {
      console.error("Error rendering Venn diagram:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Clear any partial rendering
      svg.selectAll("*").remove();

      // Show error message
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "red")
        .style("font-weight", "bold")
        .text("Error rendering Venn diagram");

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 10)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#666")
        .text(errorMessage);

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 30)
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .style("fill", "#999")
        .text("Check console for details");
    }

    return () => {
      // Use captured ref value in cleanup
      if (containerRef) {
        d3.select(containerRef).selectAll("*").remove();
      }
    };
  }, [data, width, height]);

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
  );
}
