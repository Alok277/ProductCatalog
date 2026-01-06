# Venn Diagram Library Comparison

## Available Libraries for Complex Venn Diagrams

### 1. **venn.js** (Currently Installed) ✅
- **Best for**: 2-6 sets with automatic layout
- **Pros**: 
  - Automatic area-proportional layout
  - Handles complex intersections
  - Works with D3.js
  - No manual calculations needed
- **Cons**: 
  - Limited to 6 sets
  - May struggle with very complex nested relationships
- **Usage**: See `SegmentationVennLibrary.tsx`

### 2. **react-venn-diagram**
- **Install**: `npm install react-venn-diagram`
- **Best for**: React-specific implementations
- **Pros**: React-friendly API, TypeScript support
- **Cons**: Less flexible than venn.js

### 3. **UpSet.js**
- **Install**: `npm install @upsetjs/react`
- **Best for**: More than 6 sets (uses matrix visualization)
- **Pros**: Handles unlimited sets, alternative visualization
- **Cons**: Different visualization style (not traditional Venn)

### 4. **DeepVenn** (Web-based)
- **Best for**: Up to 10 sets using deep learning
- **Pros**: Handles very complex cases
- **Cons**: Web-based tool, not a library

## Recommendation

For your use case:
1. **Use `venn.js` (already installed)** for most cases (2-6 sets)
2. **Use `UpSet.js`** if you need more than 6 sets
3. **Keep custom implementation** for specific nested relationships

## Implementation Examples

### Simple Case (2-3 sets)
```typescript
import SegmentationVennLibrary from '@/components/SegmentationVennLibrary'

const data = {
  Event_1: 1200,
  Event_2: 900,
  Event_1_AND_Event_2: 700
}

<SegmentationVennLibrary data={data} />
```

### Complex Case (4+ sets)
```typescript
const complexData = {
  Event_1: 1200,
  Event_2: 900,
  Event_3: 700,
  Event_4: 500,
  Event_1_AND_Event_2: 600,
  Event_2_AND_Event_3: 400,
  Event_1_AND_Event_2_AND_Event_3: 300
}

<SegmentationVennLibrary data={complexData} width={1000} height={800} />
```

