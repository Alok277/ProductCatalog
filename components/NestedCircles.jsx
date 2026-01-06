"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { nestedCirclesData } from "./data";

// Helper function to calculate triple intersection path
const calculateTripleIntersection = (pos1, pos2, pos3, radius) => {
  // For now, return null to use circle fallback
  // This can be enhanced later with actual path calculation
  return null;
};

const NestedCircles = () => {
  const ref = useRef(null);
  const [tooltip, setTooltip] = useState({
    x: 0,
    y: 0,
    text: "",
    visible: false,
  });
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [highlightedCircles, setHighlightedCircles] = useState([]);

  useEffect(() => {
    const containerRef = ref.current;
    if (!containerRef) return;

    // Clear previous content
    d3.select(containerRef).selectAll("*").remove();

    const width = 400;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create SVG
    const svg = d3
      .select(containerRef)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Calculate scale factor based on outer circle size
    const maxSize = nestedCirclesData.outer.size;
    const scaleFactor =
      (Math.min(width, height) / 2 / Math.sqrt(maxSize)) * 0.9;

    // Draw outer circle (large container) - Light blue
    const outerRadius = Math.sqrt(nestedCirclesData.outer.size) * scaleFactor;

    svg
      .append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", outerRadius)
      .attr("class", "outer-circle")
      .style("fill", "#E0F2FE") // Light blue
      .style("fill-opacity", selectedCircle === "outer" ? 0.6 : 0.4)
      .style("stroke", "#0EA5E9") // Sky blue border
      .style("stroke-width", selectedCircle === "outer" ? 3 : 2)
      .style("cursor", "pointer")
      .style("transition", "all 0.3s ease")
      .on("mouseover", function (event) {
        if (selectedCircle !== "outer") {
          d3.select(this).style("fill-opacity", 0.5);
        }
        const rect = containerRef.getBoundingClientRect();
        setTooltip((prev) => ({
          ...prev,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          text: `${
            nestedCirclesData.outer.name
          }: ${nestedCirclesData.outer.size.toLocaleString()} users`,
          visible: true,
        }));
      })
      .on("mouseout", function () {
        if (selectedCircle !== "outer") {
          d3.select(this).style("fill-opacity", 0.4);
        }
        setTooltip((prev) => ({ ...prev, visible: false }));
      })
      .on("click", function () {
        setSelectedCircle((prev) => (prev === "outer" ? null : "outer"));
        setHighlightedCircles([]);
      });

    // Draw inner circles (segments) with overlapping intersections
    const innerCircles = nestedCirclesData.inner;
    const angleStep = (2 * Math.PI) / innerCircles.length;
    // For 3 segments, position them in a triangle formation like the reference
    const innerRadius = outerRadius * 0.4; // Closer to center for better overlap

    // Colors matching the Figma design - purple and blue shades
    const colors = [
      "#06B6D4", // Cyan
      "#8B5A2B", // Brown
      "#84CC16", // Lime
      "#8B5CF6", // Purple
      "#3B82F6", // Blue
      "#6366F1", // Indigo
      "#EC4899", // Pink
      "#10B981", // Emerald
      "#F59E0B", // Amber
      "#EF4444", // Red
    ];

    // Store circle positions for drawing connections and intersections
    const circlePositions = {};

    console.log(innerCircles, "innerCircles>>");

    // First pass: Calculate all circle positions
    innerCircles.forEach((circle, index) => {
      const angle = index * angleStep - Math.PI / 2;

      const baseRadius = innerRadius;
      // Make circles larger for better visibility
      const circleRadius = Math.sqrt(circle.size) * scaleFactor * 0.5; // Larger circles
      const overlapOffset = circleRadius * 0.4; // Moderate overlap for visibility

      let x, y;
      // For 3 segments, position them in a triangle formation
      // Segment 1: top, Segment 2: bottom-left, Segment 3: bottom-right
      if (innerCircles.length === 3) {
        if (index === 0) {
          // Segment 1 - top
          x = centerX;
          y = centerY - innerRadius * 0.6;
        } else if (index === 1) {
          // Segment 2 - bottom-left
          x = centerX - innerRadius * 0.5;
          y = centerY + innerRadius * 0.4;
        } else {
          // Segment 3 - bottom-right
          x = centerX + innerRadius * 0.5;
          y = centerY + innerRadius * 0.4;
        }
      } else {
        // For other numbers, use circular arrangement
        if (circle.intersectsWith && circle.intersectsWith.length > 0) {
          const intersectIndex = innerCircles.findIndex(
            (c) => c.name === circle.intersectsWith[0]
          );
          if (intersectIndex >= 0) {
            const intersectAngle = intersectIndex * angleStep - Math.PI / 2;
            const avgAngle = (angle + intersectAngle) / 2;
            const distanceFromCenter = baseRadius - overlapOffset;
            x = centerX + distanceFromCenter * Math.cos(avgAngle);
            y = centerY + distanceFromCenter * Math.sin(avgAngle);
          } else {
            x = centerX + (baseRadius - overlapOffset * 0.3) * Math.cos(angle);
            y = centerY + (baseRadius - overlapOffset * 0.3) * Math.sin(angle);
          }
        } else {
          x = centerX + (baseRadius - overlapOffset * 0.3) * Math.cos(angle);
          y = centerY + (baseRadius - overlapOffset * 0.3) * Math.sin(angle);
        }
      }

      // Store the calculated radius
      const finalRadius = Math.sqrt(circle.size) * scaleFactor * 0.5;
      circlePositions[circle.name] = {
        x,
        y,
        radius: finalRadius,
        color: colors[index % colors.length],
      };
    });

    // Second pass: Draw intersection areas using SVG path for actual overlap
    // Use a set to track drawn intersections to avoid duplicates
    const drawnIntersections = new Set();

    // Draw intersections for all circles that overlap (both specified and adjacent)
    innerCircles.forEach((circle, index) => {
      // Get all circles this circle should intersect with
      const circlesToIntersect = new Set();

      // Add explicitly defined intersections
      if (circle.intersectsWith) {
        circle.intersectsWith.forEach((name) => circlesToIntersect.add(name));
      }

      // Also add adjacent circles (next and previous in the circle)
      const nextIndex = (index + 1) % innerCircles.length;
      const prevIndex = (index - 1 + innerCircles.length) % innerCircles.length;
      circlesToIntersect.add(innerCircles[nextIndex].name);
      circlesToIntersect.add(innerCircles[prevIndex].name);

      // Draw intersections with all these circles
      circlesToIntersect.forEach((intersectName) => {
        // Create unique key for intersection pair
        const pairKey = [circle.name, intersectName].sort().join("-");
        if (drawnIntersections.has(pairKey)) return;
        drawnIntersections.add(pairKey);

        const intersectCircle = circlePositions[intersectName];
        const currentCircle = circlePositions[circle.name];

        if (intersectCircle && currentCircle) {
          const dx = currentCircle.x - intersectCircle.x;
          const dy = currentCircle.y - intersectCircle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const r1 = currentCircle.radius;
          const r2 = intersectCircle.radius;

          // Only draw intersection if circles actually overlap
          if (distance < r1 + r2 && distance > Math.abs(r1 - r2)) {
            // Calculate intersection area using circle-circle intersection formula
            const a =
              (r1 * r1 - r2 * r2 + distance * distance) / (2 * distance);
            const h = Math.sqrt(r1 * r1 - a * a);

            // Intersection points
            const px = currentCircle.x + a * (dx / distance);
            const py = currentCircle.y + a * (dy / distance);

            // Find the two intersection points
            const ix1 = px + h * (-dy / distance);
            const iy1 = py + h * (dx / distance);
            const ix2 = px - h * (-dy / distance);
            const iy2 = py - h * (dx / distance);

            // Calculate angles for both circles at intersection points
            const angle1a = Math.atan2(
              iy1 - currentCircle.y,
              ix1 - currentCircle.x
            );
            const angle1b = Math.atan2(
              iy2 - currentCircle.y,
              ix2 - currentCircle.x
            );
            const angle2a = Math.atan2(
              iy1 - intersectCircle.y,
              ix1 - intersectCircle.x
            );
            const angle2b = Math.atan2(
              iy2 - intersectCircle.y,
              ix2 - intersectCircle.x
            );

            // Determine which arc to use for the intersection (the arc that forms the overlap)
            // For circle 1: go from iy1 to iy2 through the overlap
            const angleDiff1 =
              (angle1b - angle1a + 2 * Math.PI) % (2 * Math.PI);
            // For circle 2: go from iy2 to iy1 through the overlap (opposite direction)
            const angleDiff2 =
              (angle2a - angle2b + 2 * Math.PI) % (2 * Math.PI);

            // Use the smaller arc (the one that forms the intersection)
            const largeArc1 = angleDiff1 > Math.PI ? 1 : 0;
            const largeArc2 = angleDiff2 > Math.PI ? 1 : 0;

            // Create intersection path - the overlapping region
            const intersectionPath = `M ${ix1} ${iy1} 
              A ${r1} ${r1} 0 ${largeArc1} 1 ${ix2} ${iy2}
              A ${r2} ${r2} 0 ${largeArc2} 1 ${ix1} ${iy1} Z`;

            // Calculate intersection size - use defined size or estimate based on overlap
            let intersectionSize = circle.intersectionSize || 0;
            // If no explicit size, estimate based on circle sizes and overlap
            if (intersectionSize === 0) {
              const intersectCircleData = innerCircles.find(
                (c) => c.name === intersectName
              );
              const minSize = Math.min(
                circle.size,
                intersectCircleData?.size || 0
              );
              intersectionSize = minSize * 0.3; // Estimate 30% overlap
            }

            // Use darker purple/blue for intersections matching the Figma design
            const intersectionColors = {
              "Segment 1-Segment 2": "#7C3AED", // Dark Purple
              "Segment 1-Segment 3": "#6D28D9", // Darker Purple
              "Segment 2-Segment 3": "#2563EB", // Dark Blue
            };

            const colorKey = [circle.name, intersectName].sort().join("-");
            const intersectionColor = intersectionColors[colorKey] || "#7C3AED"; // Default to dark purple

            // Draw intersection area as a path with distinct color -
            svg
              .append("path")
              .attr("d", intersectionPath)
              .attr(
                "class",
                `intersection intersection-${circle.name}-${intersectName}`
              )
              .style("fill", intersectionColor)
              .style("fill-opacity", 0.65) // More visible like Figma
              .style("stroke", d3.rgb(intersectionColor).darker(0.3))
              .style("stroke-width", 1.5)
              .style("pointer-events", "all")
              .style("cursor", "pointer")
              .on("mouseover", function (event) {
                d3.select(this).style("fill-opacity", 0.8);
                const rect = containerRef.getBoundingClientRect();
                setTooltip((prev) => ({
                  ...prev,
                  x: event.clientX - rect.left,
                  y: event.clientY - rect.top,
                  text: `${
                    circle.name
                  } ∩ ${intersectName}: ${intersectionSize.toLocaleString()} users`,
                  visible: true,
                }));
              })
              .on("mouseout", function () {
                d3.select(this).style("fill-opacity", 0.65);
                setTooltip((prev) => ({ ...prev, visible: false }));
              });
          }
        }
      });
    });

    // Third pass: Draw the circles themselves
    innerCircles.forEach((circle, index) => {
      const { x, y, radius: circleRadius } = circlePositions[circle.name];

      const isSelected = selectedCircle === circle.name;
      const isHighlighted = highlightedCircles.includes(circle.name);
      const isRelated =
        selectedCircle &&
        nestedCirclesData.inner
          .find((c) => c.name === selectedCircle)
          ?.relatedTo?.includes(circle.name);
      const isIntersecting =
        selectedCircle &&
        nestedCirclesData.inner
          .find((c) => c.name === selectedCircle)
          ?.intersectsWith?.includes(circle.name);

      svg
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", circleRadius)
        .attr("class", `inner-circle circle-${circle.name}`)
        .attr("data-name", circle.name)
        .style("fill", colors[index % colors.length])
        .style(
          "fill-opacity",
          isSelected
            ? 0.4
            : isHighlighted
            ? 0.35
            : isIntersecting
            ? 0.3
            : isRelated
            ? 0.25
            : 0.25
        ) // More translucent like Figma
        .style("stroke", d3.rgb(colors[index % colors.length]).darker(0.5))
        .style("stroke-width", isSelected ? 3 : isHighlighted ? 2.5 : 2)
        .style("cursor", "pointer")
        .style("transition", "all 0.3s ease")
        .on("mouseover", function (event) {
          if (!isSelected) {
            d3.select(this).style("fill-opacity", 0.85);
            d3.select(this).attr("r", circleRadius * 1.1);
          }

          const related = circle.relatedTo || [];
          const intersecting = circle.intersectsWith || [];
          setHighlightedCircles([...related, ...intersecting]);

          const rect = containerRef.getBoundingClientRect();
          const relatedText =
            related.length > 0 ? `\nRelated: ${related.join(", ")}` : "";
          const intersectText =
            intersecting.length > 0
              ? `\nIntersects: ${intersecting.join(", ")}`
              : "";
          setTooltip((prev) => ({
            ...prev,
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            text: `${
              circle.name
            }: ${circle.size.toLocaleString()}${relatedText}${intersectText}`,
            visible: true,
          }));
        })
        .on("mouseout", function () {
          if (!isSelected) {
            d3.select(this).style("fill-opacity", 0.5);
            d3.select(this).attr("r", circleRadius);
          }
          setHighlightedCircles([]);
          setTooltip((prev) => ({ ...prev, visible: false }));
        })
        .on("click", function () {
          setSelectedCircle((prev) =>
            prev === circle.name ? null : circle.name
          );
          setHighlightedCircles([
            ...(circle.relatedTo || []),
            ...(circle.intersectsWith || []),
          ]);
        });

      // Add label for each inner circle -  style
      // Segment name
      svg
        .append("text")
        .attr("x", x)
        .attr("y", y - 8)
        .attr("text-anchor", "middle")
        .attr("class", `circle-label label-${circle.name}`)
        .style("font-size", isSelected ? "14px" : "12px")
        .style("font-weight", "600")
        .style("fill", isSelected ? "#000" : "#1F2937")
        .style("pointer-events", "none")
        .style("transition", "all 0.3s ease")
        .text(circle.name);

      // User count below segment name
      svg
        .append("text")
        .attr("x", x)
        .attr("y", y + 8)
        .attr("text-anchor", "middle")
        .attr("class", `circle-count count-${circle.name}`)
        .style("font-size", isSelected ? "11px" : "10px")
        .style("font-weight", "400")
        .style("fill", "#6B7280")
        .style("pointer-events", "none")
        .style("transition", "all 0.3s ease")
        .text(`${circle.size.toLocaleString()} users`);
    });

    // Draw three-way intersections (all segments overlap)
    if (nestedCirclesData.tripleIntersections) {
      nestedCirclesData.tripleIntersections.forEach((triple) => {
        const pos1 = circlePositions[triple.sets[0]];
        const pos2 = circlePositions[triple.sets[1]];
        const pos3 = circlePositions[triple.sets[2]];

        if (pos1 && pos2 && pos3) {
          // Calculate the center of the three circles
          const tripleCenterX = (pos1.x + pos2.x + pos3.x) / 3;
          const tripleCenterY = (pos1.y + pos2.y + pos3.y) / 3;

          // Calculate the intersection area using the smallest radius
          const minRadius = Math.min(pos1.radius, pos2.radius, pos3.radius);
          const tripleRadius = Math.sqrt(triple.size) * scaleFactor * 0.4;

          // Draw the triple intersection as a darker purple area ()
          // Calculate the actual intersection area using path instead of circle
          const tripleIntersectionPath = calculateTripleIntersection(
            pos1,
            pos2,
            pos3,
            tripleRadius
          );

          if (tripleIntersectionPath) {
            svg
              .append("path")
              .attr("d", tripleIntersectionPath)
              .attr("class", `triple-intersection`)
              .style("fill", "#5B21B6") // Very dark purple
              .style("fill-opacity", 0.75)
              .style("stroke", "#4C1D95")
              .style("stroke-width", 1.5)
              .style("pointer-events", "all")
              .style("cursor", "pointer")
              .on("mouseover", function (event) {
                d3.select(this).style("fill-opacity", 0.9);
                const rect = containerRef.getBoundingClientRect();
                setTooltip((prev) => ({
                  ...prev,
                  x: event.clientX - rect.left,
                  y: event.clientY - rect.top,
                  text: `OVERLAPPING USERS\n${triple.sets.join(
                    " ∩ "
                  )}: ${triple.size.toLocaleString()} users`,
                  visible: true,
                }));
              })
              .on("mouseout", function () {
                d3.select(this).style("fill-opacity", 0.75);
                setTooltip((prev) => ({ ...prev, visible: false }));
              });
          } else {
            // Fallback to circle if path calculation fails
            svg
              .append("circle")
              .attr("cx", tripleCenterX)
              .attr("cy", tripleCenterY)
              .attr("r", tripleRadius)
              .attr("class", `triple-intersection`)
              .style("fill", "#5B21B6")
              .style("fill-opacity", 0.75)
              .style("stroke", "#4C1D95")
              .style("stroke-width", 1.5)
              .style("pointer-events", "all")
              .style("cursor", "pointer")
              .on("mouseover", function (event) {
                d3.select(this).style("fill-opacity", 0.9);
                const rect = containerRef.getBoundingClientRect();
                setTooltip((prev) => ({
                  ...prev,
                  x: event.clientX - rect.left,
                  y: event.clientY - rect.top,
                  text: `OVERLAPPING USERS\n${triple.sets.join(
                    " ∩ "
                  )}: ${triple.size.toLocaleString()} users`,
                  visible: true,
                }));
              })
              .on("mouseout", function () {
                d3.select(this).style("fill-opacity", 0.75);
                setTooltip((prev) => ({ ...prev, visible: false }));
              });
          }
        }
      });
    }

    // Draw connections between related circles when one is selected
    if (selectedCircle && selectedCircle !== "outer") {
      const selectedCircleData = nestedCirclesData.inner.find(
        (c) => c.name === selectedCircle
      );
      if (selectedCircleData?.relatedTo) {
        selectedCircleData.relatedTo.forEach((relatedName) => {
          const relatedCircle = circlePositions[relatedName];
          const selectedCirclePos = circlePositions[selectedCircle];

          if (relatedCircle && selectedCirclePos) {
            svg
              .append("line")
              .attr("x1", selectedCirclePos.x)
              .attr("y1", selectedCirclePos.y)
              .attr("x2", relatedCircle.x)
              .attr("y2", relatedCircle.y)
              .attr("class", "connection-line")
              .style("stroke", "#8B5CF6")
              .style("stroke-width", 2)
              .style("stroke-dasharray", "5,5")
              .style("opacity", 0.6)
              .style("pointer-events", "none");
          }
        });
      }
    }

    // Add outer circle label -  style
    svg
      .append("text")
      .attr("x", centerX)
      .attr("y", centerY - outerRadius - 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .style("fill", "#0F172A")
      .text(nestedCirclesData.outer.name);

    // Add user count below outer circle label
    svg
      .append("text")
      .attr("x", centerX)
      .attr("y", centerY - outerRadius + 5)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "400")
      .style("fill", "#64748B")
      .text(`${nestedCirclesData.outer.size.toLocaleString()} users`);

    return () => {
      if (containerRef) {
        d3.select(containerRef).selectAll("*").remove();
      }
    };
  }, [selectedCircle, highlightedCircles]);

  return (
    <div className="relative w-full flex justify-center">
      <div ref={ref} className="nested-circles-container" />
      {tooltip.visible && (
        <div
          className="absolute bg-black text-white px-3 py-2 rounded shadow-lg z-50 pointer-events-none text-sm whitespace-pre-line"
          style={{ left: `${tooltip.x + 20}px`, top: `${tooltip.y + 20}px` }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default NestedCircles;
