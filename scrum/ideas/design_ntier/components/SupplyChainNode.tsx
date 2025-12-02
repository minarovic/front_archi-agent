import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface NodeData {
  tier: string;
  company: string;
  riskScore: number;
  tierLevel: number;
  riskColor: string;
  bgColor: string;
  borderColor: string;
  borderWidth: number;
}

const SupplyChainNode = memo(({ data }: NodeProps<NodeData>) => {
  const isT1 = data.tierLevel === 1;
  const isT2 = data.tierLevel === 2;
  const isT3 = data.tierLevel === 3;

  return (
    <div
      style={{
        backgroundColor: data.bgColor,
        border: `${data.borderWidth}px solid ${data.borderColor}`,
        borderRadius: isT1 ? '2px' : '3px',
        padding: isT1 ? '8px 10px' : '4px 6px',
        width: isT1 ? '100px' : '70px',
        height: isT1 ? '50px' : isT2 ? '45px' : '40px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: 1.3,
      }}
    >
      {/* Top handles - HIDDEN */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, pointerEvents: 'none' }}
      />

      {/* Tier label - bold */}
      <div
        style={{
          fontSize: isT1 ? '12px' : isT2 ? '10px' : '8px',
          fontWeight: 700,
          color: isT1 ? '#FFFFFF' : data.riskColor,
          marginBottom: '1px',
        }}
      >
        {data.tier}
      </div>

      {/* Company name - normal weight */}
      <div
        style={{
          fontSize: isT1 ? '11px' : isT2 ? '9px' : '9px',
          fontWeight: 400,
          color: isT1 ? '#78FAAE' : '#374151',
          marginBottom: isT1 ? '0' : '1px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%',
        }}
      >
        {data.company}
      </div>

      {/* Risk score - smaller font */}
      {!isT1 && (
        <div
          style={{
            fontSize: isT2 ? '8px' : '7px',
            fontWeight: 400,
            color: data.riskColor,
          }}
        >
          Risk: {data.riskScore}
        </div>
      )}

      {/* Bottom handles - HIDDEN */}
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

SupplyChainNode.displayName = 'SupplyChainNode';

export default SupplyChainNode;
