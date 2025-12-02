import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { SKODA_COLORS, NODE_DIMENSIONS } from '@/src/lib/graph-shared';

interface OwnershipNodeData {
  depth: number;
  company: string;
  country: string;
  entity_id: string;
  isRoot?: boolean;
  labelOverride?: string; // For custom labels like "MY COMPANY"
}

/**
 * Ownership Graph Node Component
 *
 * Visual design copied 1:1 from SupplyChainNode (MCOP-03G v2)
 * but with ownership-specific terminology:
 * - "DEPTH X" instead of "TIER X"
 * - "MY COMPANY" for root node
 * - Neutral color palette (gray/white)
 *
 * Node sizes match supply chain:
 * - Depth 0 (root): 100×50px
 * - Depth 1: 70×45px
 * - Depth 2+: 70×40px
 */
const OwnershipNode = memo(({ data }: NodeProps<OwnershipNodeData>) => {
  const isRoot = data.depth === 0 || data.isRoot;
  const isDepth1 = data.depth === 1;
  const isDepth2Plus = data.depth >= 2;

  // Determine node dimensions
  const dimensions = isRoot
    ? NODE_DIMENSIONS.depth0
    : isDepth1
    ? NODE_DIMENSIONS.depth1
    : NODE_DIMENSIONS.depth2Plus;

  // Determine label text
  const tierLabel = data.labelOverride || (isRoot ? 'MY COMPANY' : `DEPTH ${data.depth}`);

  // Color scheme (neutral for ownership, can be switched to risk later)
  const bgColor = isRoot ? SKODA_COLORS.primaryDark : SKODA_COLORS.white;
  const borderColor = isRoot ? SKODA_COLORS.primaryLight : SKODA_COLORS.gray200;
  const borderWidth = isRoot ? 2 : 1;
  const labelColor = isRoot ? SKODA_COLORS.white : SKODA_COLORS.gray500;
  const companyColor = isRoot ? SKODA_COLORS.primaryLight : SKODA_COLORS.gray700;
  const countryColor = isRoot ? SKODA_COLORS.primaryLight : SKODA_COLORS.gray500;

  // Font sizes
  const labelSize = isRoot ? '10px' : isDepth1 ? '8px' : '7px';
  const companySize = isRoot ? '11px' : '9px';
  const countrySize = isRoot ? '9px' : isDepth1 ? '8px' : '7px';

  return (
    <div
      style={{
        backgroundColor: bgColor,
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: '2px',
        padding: isRoot ? '8px 10px' : '4px 6px',
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        textAlign: 'left',
        position: 'relative',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        transition: 'border-color 150ms ease-in-out',
      }}
      className="hover:border-[#78FAAE]"
    >
      {/* Top handle - HIDDEN */}
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ opacity: 0, pointerEvents: 'none' }}
        />
      )}

      {/* Depth label - uppercase, bold */}
      <div
        style={{
          fontSize: labelSize,
          fontWeight: 700,
          color: labelColor,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '1px',
          lineHeight: 1.2,
        }}
      >
        {tierLabel}
      </div>

      {/* Company name - semi-bold */}
      <div
        style={{
          fontSize: companySize,
          fontWeight: 600,
          color: companyColor,
          marginBottom: '1px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%',
          lineHeight: 1.3,
        }}
      >
        {data.company}
      </div>

      {/* Country code - regular */}
      <div
        style={{
          fontSize: countrySize,
          fontWeight: 400,
          color: countryColor,
          lineHeight: 1.2,
        }}
      >
        {data.country}
      </div>

      {/* Bottom handles - HIDDEN but functional for edge routing */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ opacity: 0, pointerEvents: 'none' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-left"
        style={{ left: '25%', opacity: 0, pointerEvents: 'none' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-right"
        style={{ left: '75%', opacity: 0, pointerEvents: 'none' }}
      />
    </div>
  );
});

OwnershipNode.displayName = 'OwnershipNode';

export default OwnershipNode;
