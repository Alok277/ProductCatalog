'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import SegmentationVenn from '@/components/SegmentationVenn'
import SegmentationVennLibrary from '@/components/SegmentationVennLibrary'

// Step 1: DSL Query Example
const dslQuery = `(
  /* GROUP A: Nested Events (Event_2 is a subset of Event_1) */
  (
    did Event_1
    WHERE Property_1_1 = "Value"
    AND Property_1_2 = "Value"
    AND Property_1_3 IN ("A","B","C")
    AND Property_1_4 > 10
    AND Property_1_5 != "None"
    FROM 18 Dec 2025 TO 24 Dec 2025
  )
  AND
  (
    /* Event_2 is nested inside Event_1 (subset relationship) */
    did Event_2
    WHERE Property_2_1 LIKE "%keyword%"
    AND Property_2_2 = "Value"
    AND Property_2_3 IS NOT NULL
    AND Event_1 = true  /* Event_2 requires Event_1 to have occurred */
    FROM 18 Dec 2025 TO 24 Dec 2025
  )
)
AND
(
  /* GROUP B: Conditional Blocks (ANY of these is okay) */
  (
    did Event_3
    WHERE Property_3_1 = "Value"
    AND Property_3_2 <= 20
    FROM 18 Dec 2025 TO 24 Dec 2025
  )
  OR
  (
    did Event_4
    WHERE Property_4_1 STARTS WITH "abc"
    AND Property_4_2 ENDS WITH "xyz"
    FROM 18 Dec 2025 TO 24 Dec 2025
  )
  OR
  (
    did Event_5
    WHERE Property_5_1 BETWEEN 1 AND 5
    AND Property_5_2 IN ("M","F","O")
    FROM 18 Dec 2025 TO 24 Dec 2025
  )
)
AND
(
  /* GROUP C: Advanced Combination (Any 2 must match) */
  (
    (
      did Event_6
      WHERE Property_6_1 = "Value"
    )
    AND
    (
      did Event_7
      WHERE Property_7_1 > 0
    )
  )
  OR
  (
    (
      did Event_8
      WHERE Property_8_1 < 100
    )
    AND
    (
      did Event_9
      WHERE Property_9_1 != "unknown"
    )
  )
  OR
  (
    did Event_10
    WHERE Property_10_1 CONTAINS "mobile"
  )
)`

// Step 2: JSON Representation
const jsonRepresentation = {
  operator: "AND",
  groups: [
    {
      name: "Group A",
      operator: "NESTED", // Changed from "AND" to "NESTED" to indicate subset relationship
      description: "Nested Events (Event_2 is a subset of Event_1)",
      relationship: "subset", // Indicates Event_2 is inside Event_1
      events: [
        {
          name: "Event_1",
          role: "outer", // Outer circle - larger set
          conditions: {
            Property_1_1: { operator: "=", value: "Value" },
            Property_1_2: { operator: "=", value: "Value" },
            Property_1_3: { operator: "IN", value: ["A", "B", "C"] },
            Property_1_4: { operator: ">", value: 10 },
            Property_1_5: { operator: "!=", value: "None" }
          },
          dateRange: { from: "18 Dec 2025", to: "24 Dec 2025" }
        },
        {
          name: "Event_2",
          role: "inner", // Inner circle - subset
          requires: ["Event_1"], // Event_2 requires Event_1 to have occurred
          conditions: {
            Property_2_1: { operator: "LIKE", value: "%keyword%" },
            Property_2_2: { operator: "=", value: "Value" },
            Property_2_3: { operator: "IS NOT NULL" }
          },
          dateRange: { from: "18 Dec 2025", to: "24 Dec 2025" }
        }
      ]
    },
    {
      name: "Group B",
      operator: "OR",
      description: "Conditional Blocks (ANY of these is okay)",
      events: [
        {
          name: "Event_3",
          conditions: {
            Property_3_1: { operator: "=", value: "Value" },
            Property_3_2: { operator: "<=", value: 20 }
          },
          dateRange: { from: "18 Dec 2025", to: "24 Dec 2025" }
        },
        {
          name: "Event_4",
          conditions: {
            Property_4_1: { operator: "STARTS WITH", value: "abc" },
            Property_4_2: { operator: "ENDS WITH", value: "xyz" }
          },
          dateRange: { from: "18 Dec 2025", to: "24 Dec 2025" }
        },
        {
          name: "Event_5",
          conditions: {
            Property_5_1: { operator: "BETWEEN", value: [1, 5] },
            Property_5_2: { operator: "IN", value: ["M", "F", "O"] }
          },
          dateRange: { from: "18 Dec 2025", to: "24 Dec 2025" }
        }
      ]
    },
    {
      name: "Group C",
      operator: "OR",
      description: "Advanced Combination (Any 2 must match)",
      subGroups: [
        {
          operator: "AND",
          events: [
            { name: "Event_6", conditions: { Property_6_1: { operator: "=", value: "Value" } } },
            { name: "Event_7", conditions: { Property_7_1: { operator: ">", value: 0 } } }
          ]
        },
        {
          operator: "AND",
          events: [
            { name: "Event_8", conditions: { Property_8_1: { operator: "<", value: 100 } } },
            { name: "Event_9", conditions: { Property_9_1: { operator: "!=", value: "unknown" } } }
          ]
        },
        {
          operator: "SINGLE",
          events: [
            { name: "Event_10", conditions: { Property_10_1: { operator: "CONTAINS", value: "mobile" } } }
          ]
        }
      ]
    }
  ]
}

// Step 3: Backend Evaluation Example
const backendEvaluationExample = `
// Backend Evaluation Logic (Pseudo-code)

function evaluateSegmentation(query, userEvents) {
  // Group A: AND operation
  const groupA = 
    evaluateEvent(query.groups[0].events[0], userEvents) &&
    evaluateEvent(query.groups[0].events[1], userEvents);
  
  // Group B: OR operation
  const groupB = 
    evaluateEvent(query.groups[1].events[0], userEvents) ||
    evaluateEvent(query.groups[1].events[1], userEvents) ||
    evaluateEvent(query.groups[1].events[2], userEvents);
  
  // Group C: OR of sub-groups
  const groupC = 
    (evaluateEvent(query.groups[2].subGroups[0].events[0], userEvents) &&
     evaluateEvent(query.groups[2].subGroups[0].events[1], userEvents)) ||
    (evaluateEvent(query.groups[2].subGroups[1].events[0], userEvents) &&
     evaluateEvent(query.groups[2].subGroups[1].events[1], userEvents)) ||
    evaluateEvent(query.groups[2].subGroups[2].events[0], userEvents);
  
  // Final result: AND of all groups
  return groupA && groupB && groupC;
}

function evaluateEvent(event, userEvents) {
  const userEvent = userEvents.find(e => e.name === event.name);
  if (!userEvent) return false;
  
  // Check date range
  if (!isInDateRange(userEvent.timestamp, event.dateRange)) return false;
  
  // Check all conditions
  for (const [prop, condition] of Object.entries(event.conditions)) {
    if (!evaluateCondition(userEvent.properties[prop], condition)) {
      return false;
    }
  }
  
  return true;
}

function evaluateCondition(value, condition) {
  switch (condition.operator) {
    case "=": return value === condition.value;
    case "!=": return value !== condition.value;
    case ">": return value > condition.value;
    case "<": return value < condition.value;
    case "<=": return value <= condition.value;
    case "IN": return condition.value.includes(value);
    case "LIKE": return value.includes(condition.value.replace('%', ''));
    case "STARTS WITH": return value.startsWith(condition.value);
    case "ENDS WITH": return value.endsWith(condition.value);
    case "CONTAINS": return value.includes(condition.value);
    case "IS NOT NULL": return value !== null && value !== undefined;
    case "BETWEEN": return value >= condition.value[0] && value <= condition.value[1];
    default: return false;
  }
}

// Count users for each event/intersection
function countSegmentation(query, allUsers) {
  const counts = {};
  
  // Count individual events
  query.groups.forEach(group => {
    if (group.events) {
      group.events.forEach(event => {
        counts[event.name] = allUsers.filter(user => 
          evaluateEvent(event, user.events)
        ).length;
      });
    }
    
    // Count nested relationships for NESTED groups
    if (group.operator === "NESTED" && group.events.length === 2) {
      // For nested sets, inner event (Event_2) is a subset of outer event (Event_1)
      // Count users in outer circle (Event_1)
      counts[group.events[0].name] = allUsers.filter(user => 
        evaluateEvent(group.events[0], user.events)
      ).length;
      
      // Count users in inner circle (Event_2) - must also satisfy Event_1
      counts[group.events[1].name] = allUsers.filter(user => 
        evaluateEvent(group.events[0], user.events) &&
        evaluateEvent(group.events[1], user.events)
      ).length;
    }
    
    // Count intersections for AND groups (non-nested)
    if (group.operator === "AND" && group.events.length === 2 && group.relationship !== "subset") {
      const key = \`\${group.events[0].name}_AND_\${group.events[1].name}\`;
      counts[key] = allUsers.filter(user => 
        evaluateEvent(group.events[0], user.events) &&
        evaluateEvent(group.events[1], user.events)
      ).length;
    }
  });
  
  // Count sub-group intersections
  if (query.groups[2]?.subGroups) {
    query.groups[2].subGroups.forEach(subGroup => {
      if (subGroup.operator === "AND" && subGroup.events.length === 2) {
        const key = \`\${subGroup.events[0].name}_AND_\${subGroup.events[1].name}\`;
        counts[key] = allUsers.filter(user => 
          evaluateEvent(subGroup.events[0], user.events) &&
          evaluateEvent(subGroup.events[1], user.events)
        ).length;
      } else if (subGroup.operator === "SINGLE") {
        counts[subGroup.events[0].name] = allUsers.filter(user => 
          evaluateEvent(subGroup.events[0], user.events)
        ).length;
      }
    });
  }
  
  return counts;
}
`

// Backend response data (result of evaluation)
// For nested circles with intersection:
// Event_1 (outer): 1200 users total
// Event_2 (inner): 900 users (nested inside Event_1)
// Event_3: 700 users (intersects with Event_2)
// Event_2_AND_Event_3: 400 users (intersection of Event_2 and Event_3)
const backendResponse = {
  Event_1: 1200,  // Outer circle - larger set
  Event_2: 900,   // Inner circle - subset of Event_1 (nested inside)
  Event_3: 700,   // Intersecting circle - intersects with Event_2
  Event_2_AND_Event_3: 400, // Intersection of Event_2 and Event_3
  Event_4: 400,
  Event_5: 300,
  Event_6_AND_Event_7: 200,
  Event_8_AND_Event_9: 150,
  Event_10: 600,
}

export default function VennDiagramPage() {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Segmentation Query to Venn Diagram</h1>
          <p className="text-gray-600">
            Complete workflow: DSL Query → JSON → Backend Evaluation → Visualization
          </p>
        </div>

        {/* Step Navigation */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveStep(1)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeStep === 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Step 1: DSL Query
            </button>
            <button
              onClick={() => setActiveStep(2)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeStep === 2
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Step 2: JSON Conversion
            </button>
            <button
              onClick={() => setActiveStep(3)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeStep === 3
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Step 3: Backend Evaluation
            </button>
            <button
              onClick={() => setActiveStep(4)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeStep === 4
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Step 4: Venn Visualization
            </button>
          </div>
        </div>

        {/* Step 1: DSL Query */}
        {activeStep === 1 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
              <h2 className="text-xl font-bold text-gray-900">DSL Query Structure</h2>
            </div>
            <p className="text-gray-600 mb-4">
              The segmentation query is written in a Domain-Specific Language (DSL) that defines user behavior patterns.
            </p>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono whitespace-pre">
                {dslQuery}
              </pre>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Query Structure Breakdown:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li><strong>Group A (NESTED):</strong> Event_2 is a subset of Event_1 (nested relationship)</li>
                <li><strong>Event_1 (Outer):</strong> Larger set containing all Event_1 users</li>
                <li><strong>Event_2 (Inner):</strong> Subset of Event_1 users (nested inside)</li>
                <li><strong>Group B (OR):</strong> Any one of Event_3, Event_4, or Event_5 must occur</li>
                <li><strong>Group C (OR):</strong> Any one of the sub-conditions must match</li>
                <li><strong>Final Query:</strong> Group A AND Group B AND Group C</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 2: JSON Conversion */}
        {activeStep === 2 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
              <h2 className="text-xl font-bold text-gray-900">JSON Representation</h2>
            </div>
            <p className="text-gray-600 mb-4">
              The DSL query is converted into a structured JSON format that can be processed by the backend evaluation engine.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto border border-gray-200">
              <pre className="text-sm text-gray-800 font-mono whitespace-pre">
                {JSON.stringify(jsonRepresentation, null, 2)}
              </pre>
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">JSON Structure:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li><strong>operator:</strong> Logical operator (AND/OR/NESTED) for combining groups</li>
                <li><strong>relationship:</strong> &quot;subset&quot; indicates nested relationship (one inside another)</li>
                <li><strong>groups:</strong> Array of query groups with their operators and events</li>
                <li><strong>events:</strong> Individual events with conditions and date ranges</li>
                <li><strong>role:</strong> &quot;outer&quot; or &quot;inner&quot; to indicate circle position in nested visualization</li>
                <li><strong>requires:</strong> Array of event names that must occur before this event (for nested sets)</li>
                <li><strong>conditions:</strong> Property-based filters (equals, greater than, IN, LIKE, etc.)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 3: Backend Evaluation */}
        {activeStep === 3 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
              <h2 className="text-xl font-bold text-gray-900">Backend Evaluation</h2>
            </div>
            <p className="text-gray-600 mb-4">
              The backend processes the JSON query against user event data and counts users matching each event and intersection.
            </p>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
              <pre className="text-sm text-yellow-300 font-mono whitespace-pre">
                {backendEvaluationExample}
              </pre>
            </div>
            
            <div className="mt-4 p-4 bg-purple-50 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Evaluation Process:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Parse the JSON query structure</li>
                <li>For each user, evaluate all events against their event history</li>
                <li>Apply logical operators (AND/OR) to combine results</li>
                <li>Count users matching each event and nested relationships</li>
                <li>Return counts for visualization</li>
              </ol>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Backend Response (Counts):</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(backendResponse).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">{key.replace(/_/g, ' ')}</span>
                    <span className="text-sm font-bold text-blue-600">{value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Venn Visualization */}
        {activeStep === 4 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-blue-600">4</span>
              <h2 className="text-xl font-bold text-gray-900">Venn Diagram Visualization</h2>
            </div>
            <p className="text-gray-600 mb-4">
              The backend response is visualized as nested circles with intersections. 
              Event_2 is nested inside Event_1 (subset relationship), and Event_3 intersects with Event_2, 
              creating a complex visualization showing multiple relationships.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h3 className="font-semibold text-gray-900 mb-4">Example: Group A (Event_2 nested inside Event_1, intersecting with Event_3)</h3>
              <div className="flex justify-center items-center min-h-[400px]">
                <SegmentationVenn data={backendResponse} />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-4 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Complex Multi-Set Example (Using venn.js Library)</h3>
              <p className="text-sm text-gray-600 mb-4">
                For complex data with many sets and intersections, use the library-based component that automatically handles layout.
                Note: venn.js works best with explicit intersection data. For nested relationships, use the custom component above.
              </p>
              
              {/* Example data that works well with venn.js */}
              <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-800 mb-2">
                  <strong>Example:</strong> Standard intersection data (works with venn.js):
                </p>
                <div className="flex justify-center items-center min-h-[400px]">
                  <SegmentationVennLibrary data={{
                    Event_1: 1200,
                    Event_2: 900,
                    Event_3: 700,
                    Event_1_AND_Event_2: 600,
                    Event_2_AND_Event_3: 400,
                    Event_1_AND_Event_3: 500,
                    Event_1_AND_Event_2_AND_Event_3: 300
                  }} />
                </div>
              </div>
              
              {/* Original data (may have issues with nested relationships) */}
              <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                <p className="text-xs text-yellow-800 mb-2">
                  <strong>Note:</strong> The original data has nested relationships which venn.js may not handle perfectly:
                </p>
                <div className="flex justify-center items-center min-h-[400px]">
                  <SegmentationVennLibrary data={backendResponse} />
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Visualization Mapping:</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span><strong>Event_1 (Outer Circle):</strong> {backendResponse.Event_1.toLocaleString()} users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span><strong>Event_2 (Inner Circle):</strong> {backendResponse.Event_2.toLocaleString()} users (nested inside Event_1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                  <span><strong>Event_3 (Intersecting Circle):</strong> {backendResponse.Event_3.toLocaleString()} users (intersects with Event_2)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span><strong>Event_2 ∩ Event_3:</strong> {backendResponse.Event_2_AND_Event_3.toLocaleString()} users (intersection area)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  <span><strong>Only Event_1:</strong> {(backendResponse.Event_1 - backendResponse.Event_2).toLocaleString()} users (in outer circle but not inner)</span>
                </div>
                <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                  <p className="text-xs text-gray-600">
                    <strong>Note:</strong> Event_2 is nested inside Event_1 (subset relationship), and Event_3 intersects with Event_2. 
                    The purple area shows the intersection of Event_2 and Event_3.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Complete Workflow Summary */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Complete Workflow Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
              <h3 className="font-semibold text-gray-900 mb-1">DSL Query</h3>
              <p className="text-sm text-gray-600">Write segmentation query in DSL format</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">2</div>
              <h3 className="font-semibold text-gray-900 mb-1">JSON Conversion</h3>
              <p className="text-sm text-gray-600">Convert DSL to structured JSON</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
              <h3 className="font-semibold text-gray-900 mb-1">Backend Evaluation</h3>
              <p className="text-sm text-gray-600">Process query and count users</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600 mb-2">4</div>
              <h3 className="font-semibold text-gray-900 mb-1">Visualization</h3>
              <p className="text-sm text-gray-600">Render Venn diagram with counts</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
