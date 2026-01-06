'use client'

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as venn from "@upsetjs/venn.js";
import { vennData } from "./data";

const VennDiagram = () => {
  const ref = useRef(null);

  useEffect(() => {
    // Capture ref.current for cleanup
    const containerRef = ref.current;
    if (!containerRef) return;

    // Clear previous content
    d3.select(containerRef).selectAll("*").remove();

    // Create Venn diagram
    const chart = venn.VennDiagram().width(600).height(600);

    // Create SVG container
    const svg = d3
      .select(containerRef)
      .append("svg")
      .attr("width", 600)
      .attr("height", 600);

    // Render the chart
    svg.datum(vennData).call(chart);

    // Add styling
    svg
      .selectAll("path")
      .style("fill-opacity", 0.3)
      .style("stroke-width", 2)
      .style("stroke", "#333")
      .style("cursor", "pointer");

    svg
      .selectAll("text")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#333");

    return () => {
      if (containerRef) {
        d3.select(containerRef).selectAll("*").remove();
      }
    };
  }, []);

  return <div ref={ref} className="venn-diagram-container" />;
};

export default VennDiagram;
