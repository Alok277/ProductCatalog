'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import SegmentationVenn from '@/components/SegmentationVenn'

// Backend response data
const backendData = {
  Event_1: 1200,
  Event_2: 900,
  Event_1_AND_Event_2: 700,
  Event_3: 500,
  Event_4: 400,
  Event_5: 300,
  Event_6_AND_Event_7: 200,
  Event_8_AND_Event_9: 150,
  Event_10: 600,
}

// Query structure
const segmentationRule = {
  operator: 'AND',
  groups: [
    {
      name: 'Group A',
      operator: 'AND',
      events: ['Event_1', 'Event_2'],
      description: 'Core Required Events (MUST occur)',
    },
    {
      name: 'Group B',
      operator: 'OR',
      events: ['Event_3', 'Event_4', 'Event_5'],
      description: 'Conditional Blocks (ANY of these is okay)',
    },
    {
      name: 'Group C',
      operator: 'OR',
      subGroups: [
        { operator: 'AND', events: ['Event_6', 'Event_7'] },
        { operator: 'AND', events: ['Event_8', 'Event_9'] },
        { operator: 'SINGLE', events: ['Event_10'] },
      ],
      description: 'Advanced Combination (Any 2 must match)',
    },
  ],
}

export default function VennDiagramPage() {
  const [selectedView, setSelectedView] = useState<'overview' | 'groupA' | 'groupB' | 'groupC'>('overview')

  const renderQueryStructure = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Query Structure</h3>

        {/* Group A */}
        <div className="border-l-4 border-blue-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900">Group A: {segmentationRule.groups[0].description}</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">AND</span>
          </div>
          <div className="ml-4 space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="font-medium">Event_1</span>
              <span className="text-gray-500">({backendData.Event_1} users)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Event_2</span>
              <span className="text-gray-500">({backendData.Event_2} users)</span>
            </div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
              <span className="font-semibold text-blue-600">Event_1 ∩ Event_2</span>
              <span className="text-gray-500">({backendData.Event_1_AND_Event_2} users)</span>
            </div>
          </div>
        </div>

        {/* Group B */}
        <div className="border-l-4 border-green-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900">Group B: {segmentationRule.groups[1].description}</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">OR</span>
          </div>
          <div className="ml-4 space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="font-medium">Event_3</span>
              <span className="text-gray-500">({backendData.Event_3} users)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Event_4</span>
              <span className="text-gray-500">({backendData.Event_4} users)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Event_5</span>
              <span className="text-gray-500">({backendData.Event_5} users)</span>
            </div>
          </div>
        </div>

        {/* Group C */}
        <div className="border-l-4 border-purple-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900">Group C: {segmentationRule.groups[2].description}</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">OR</span>
          </div>
          <div className="ml-4 space-y-3 text-sm text-gray-700">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">AND</span>
                <span className="font-medium">Event_6 ∩ Event_7</span>
                <span className="text-gray-500">({backendData.Event_6_AND_Event_7} users)</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">AND</span>
                <span className="font-medium">Event_8 ∩ Event_9</span>
                <span className="text-gray-500">({backendData.Event_8_AND_Event_9} users)</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">SINGLE</span>
                <span className="font-medium">Event_10</span>
                <span className="text-gray-500">({backendData.Event_10} users)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Query */}
        <div className="mt-6 pt-6 border-t-2 border-gray-300">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900">Overall Query:</span>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-semibold">
              Group A AND Group B AND Group C
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Segmentation Venn Diagram</h1>
          <p className="text-gray-600">
            Visual representation of user segmentation query with event intersections and unions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Query Structure */}
          <div>{renderQueryStructure()}</div>

          {/* Data Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Data Summary</h3>
            <div className="space-y-3">
              {Object.entries(backendData).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-medium text-gray-700">{key.replace(/_/g, ' ')}</span>
                  <span className="text-sm font-bold text-blue-600">{value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Venn Diagram */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Venn Diagram Visualization</h3>
          <div className="flex justify-center items-center min-h-[600px] bg-gray-50 rounded-lg p-4">
            <SegmentationVenn data={backendData} queryStructure={segmentationRule} />
          </div>
        </div>

        {/* Mapping Guide */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Query to Venn Mapping</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-semibold text-gray-900">Query Block</th>
                  <th className="text-left py-2 px-4 font-semibold text-gray-900">Venn Meaning</th>
                  <th className="text-left py-2 px-4 font-semibold text-gray-900">Visualization</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <span className="font-medium">Group A (AND)</span>
                    <div className="text-xs text-gray-500 mt-1">Event_1 AND Event_2</div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">Intersection</td>
                  <td className="py-3 px-4">
                    <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      Event_1 ∩ Event_2
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <span className="font-medium">Group B (OR)</span>
                    <div className="text-xs text-gray-500 mt-1">Event_3 OR Event_4 OR Event_5</div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">Union</td>
                  <td className="py-3 px-4">
                    <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      Event_3 ∪ Event_4 ∪ Event_5
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <span className="font-medium">Group C (Any 2)</span>
                    <div className="text-xs text-gray-500 mt-1">Complex combinations</div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">Pairwise intersections</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                        Event_6 ∩ Event_7
                      </span>
                      <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                        Event_8 ∩ Event_9
                      </span>
                      <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                        Event_10
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <span className="font-medium">Whole Query</span>
                    <div className="text-xs text-gray-500 mt-1">Group A AND Group B AND Group C</div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">Intersection of all groups</td>
                  <td className="py-3 px-4">
                    <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                      Final Segment
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
