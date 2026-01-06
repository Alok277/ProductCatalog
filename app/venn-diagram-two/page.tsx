'use client'

import Header from '@/components/Header'
import NestedCircles from '@/components/NestedCircles'
import { nestedCirclesData } from '@/components/data'

export default function VennDiagramTwoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Segment Overview</h1>
          <p className="text-gray-600">
            Visual representation of user segments with overlapping intersections
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Venn Diagram Visualization</h2>
          <p className="text-gray-600 mb-6">
            This visualization shows three segments (Segment 1, Segment 2, Segment 3) within the &quot;ALL USERS&quot; set.
            Each segment overlaps with the others, creating distinct intersection areas showing overlapping users.
          </p>
          
          <div className="flex justify-center items-center min-h-[800px] bg-white rounded-lg p-4">
            <NestedCircles />
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Segment Overview:</h3>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-800 mb-2">
                <span className="text-blue-600">{nestedCirclesData.outer.name}</span> - {nestedCirclesData.outer.size.toLocaleString()} users
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {nestedCirclesData.inner.map((circle, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded border border-gray-200">
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ 
                      backgroundColor: ["#8B5CF6", "#3B82F6", "#6366F1"][index] || "#8B5CF6"
                    }}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{circle.name}</div>
                    <div className="text-gray-600 text-xs">{circle.size.toLocaleString()} users</div>
                  </div>
                </div>
              ))}
            </div>
            {nestedCirclesData.tripleIntersections && nestedCirclesData.tripleIntersections.length > 0 && (
              <div className="mt-4 p-3 bg-purple-50 rounded border border-purple-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#4C1D95" }} />
                  <div>
                    <div className="font-semibold text-sm text-gray-900">OVERLAPPING USERS</div>
                    <div className="text-purple-700 font-bold">
                      {nestedCirclesData.tripleIntersections[0].size.toLocaleString()} users
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-gray-900 mb-2">Interactive Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li><strong>Hover:</strong> See tooltip with circle information and related circles</li>
              <li><strong>Click:</strong> Select a circle to highlight it and show connections to related circles</li>
              <li><strong>Connections:</strong> Purple dashed lines show relationships between circles</li>
              <li><strong>Highlighting:</strong> Related circles are highlighted when you hover or select a circle</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
