'use client';

import React from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AnalysisResponse, OwnershipData } from '@/src/types/api';
import { calculateFlatLayout } from '@/src/lib/layout-utils';
import { OwnershipTree } from '@/src/types/ownership';
import { cleanCompanyName, getCountryCode, determineSourceHandle } from '@/src/lib/graph-shared';
import OwnershipNode from './OwnershipNode';
import { NarrativeCard } from './NarrativeCard';

interface OwnershipGraphProps {
  response: AnalysisResponse<OwnershipData>;
}

export default function OwnershipGraph({ response }: OwnershipGraphProps) {
  const { data, metadata } = response;

  // Build nodes and edges from ownership tree
  const { nodes: initialNodes, edges: initialEdges } = buildGraphData(data.ownership_tree);

  // Apply compact layout for ownership (half width of supply chain)
  const compactConfig = {
    canvasWidth: 550,
    centerX: 275,
    nodeWidths: {
      level0: 100,
      level1: 70,
      level2Plus: 70,
    },
    minMargin: 50,
    minSpacing: 2,
    yPositions: {
      0: 80,
      1: 200,
      2: 330,
      3: 460,
      4: 590,
      5: 720,
    },
  };

  const { nodes: layoutedNodes, edges: layoutedEdges } = calculateFlatLayout(
    initialNodes,
    initialEdges,
    compactConfig,
    'depth' // Use depth field for level grouping
  );

  // Update edges with sourceHandle based on node positions (MCOP-03G shared logic)
  const edgesWithHandles = layoutedEdges.map((edge) => {
    const sourceNode = layoutedNodes.find(n => n.id === edge.source);
    const targetNode = layoutedNodes.find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) return edge;

    const sourceWidth = sourceNode.data.depth === 0 ? 100 : 70;
    const sourceHandle = determineSourceHandle(
      sourceNode.position.x,
      targetNode.position.x,
      sourceWidth
    );

    return {
      ...edge,
      sourceHandle,
      targetHandle: 'top',
    };
  });

  const [nodes, , onNodesChange] = useNodesState(layoutedNodes);
  const [edges, , onEdgesChange] = useEdgesState(edgesWithHandles);

  // Calculate metrics (with fallbacks for backend bug)
  const totalParents = (metadata as any)?.total_parents ?? data.total_parents ?? 0;
  const totalSubsidiaries = (metadata as any)?.total_subsidiaries ?? data.total_subsidiaries ?? 0;
  const maxDepth = (metadata as any)?.max_ownership_depth ?? data.max_ownership_depth ?? 0;

  return (
    <div className="space-y-6">
      {/* MCOP-031: LLM Insights Card */}
      {data.insights && (
        <NarrativeCard
          title="Ownership Insights"
          content={data.insights}
          icon="🏢"
        />
      )}

      {/* Hero Header - Copied 1:1 from Supply Chain (MCOP-03G v2) */}
      <div className="bg-white overflow-hidden border-t-2 border-[#4BA82E] border border-gray-200">
        {/* Header Section with Company Info */}
        <div className="bg-[#0E3A2F] px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">
                {data.focal_entity.name}
              </h2>
              <p className="text-[#78FAAE] text-base font-medium">
                {data.focal_entity.country} • Ownership Structure
              </p>
            </div>
            {/* Key Metrics Badge */}
            <div className="bg-[#1a5a42] px-6 py-3 border border-[#78FAAE]">
              <p className="text-[#78FAAE] text-xs uppercase tracking-wide mb-1">Total Entities</p>
              <p className="text-white text-2xl font-bold">
                {totalParents + totalSubsidiaries}
              </p>
            </div>
          </div>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-3 divide-x divide-gray-200 border-b border-gray-200">
          <div className="p-6 text-center bg-gradient-to-br from-white to-gray-50">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Total Parents</p>
            <p className="text-4xl font-bold text-[#4BA82E] mb-1">{totalParents}</p>
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
              <span>Upstream</span>
            </div>
          </div>
          <div className="p-6 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Total Subsidiaries</p>
            <p className="text-4xl font-bold text-[#4BA82E]">{totalSubsidiaries}</p>
            <p className="text-xs text-gray-400 mt-1">Downstream</p>
          </div>
          <div className="p-6 text-center bg-gradient-to-br from-white to-gray-50">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Max Depth</p>
            <p className="text-4xl font-bold text-[#4BA82E]">{maxDepth}</p>
            <p className="text-xs text-gray-400 mt-1">Levels</p>
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Graph + Ownership Details */}
      <div className="grid grid-cols-2 gap-6 items-start">
        {/* Left: Graph Visualization */}
        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-[#0E3A2F]">
            <h3 className="text-lg font-bold text-white">Ownership Visualization</h3>
          </div>

          {/* React Flow Canvas - Centered and Compact */}
          <div style={{ height: '600px' }} data-testid="ownership-graph">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              minZoom={1}
              maxZoom={1}
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}
              panOnScroll={false}
              panOnDrag={false}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              attributionPosition="bottom-left"
            >
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#E5E7EB" />
            </ReactFlow>
          </div>
        </div>

        {/* Right: Ownership Details (Focal + Subsidiaries) */}
        <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-[#0E3A2F]">
          <h3 className="text-lg font-bold text-white">Ownership Details</h3>
        </div>
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">{data.focal_entity.name}</h4>
            <div className="flex gap-4 text-sm mb-4">
              <span className="text-gray-600">DUNS: <span className="font-mono text-gray-900">{data.focal_entity.duns}</span></span>
              <span className="text-gray-600">Country: <span className="font-semibold text-gray-900">{data.focal_entity.country}</span></span>
              <span className="text-gray-600">Industry: <span className="font-semibold text-gray-900">{data.focal_entity.industry}</span></span>
            </div>

            {/* OWNERSHIP DATA FOR FOCAL ENTITY (if parent_companies exist) */}
            {data.parent_companies && data.parent_companies.length > 0 && (
              <div className="border border-blue-200 bg-blue-50 px-4 py-3 text-sm">
                <p className="text-xs text-blue-700 uppercase tracking-wide mb-2 font-semibold">Ownership Structure</p>
                {data.parent_companies.map((rel, idx) => (
                  <div key={`parent-${idx}`} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2 last:mb-0">
                    <div className="flex items-baseline gap-1">
                      <span className="text-blue-700">Parent:</span>
                      <span className="font-semibold text-blue-900">{rel.parent.name}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-semibold text-blue-800">Ownership</span>
                      <span className="font-bold text-blue-900">{rel.ownership_percentage.toFixed(1)}%</span>
                    </div>
                    {rel.voting_rights !== null && (
                      <div className="flex items-baseline gap-1">
                        <span className="text-blue-700">Voting</span>
                        <span className="font-semibold text-blue-900">{rel.voting_rights.toFixed(1)}%</span>
                        {rel.has_special_voting_rights && <span className="text-blue-900">⭐</span>}
                      </div>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-blue-700">Control</span>
                      <span className="font-semibold text-blue-900 capitalize">{rel.control_type}</span>
                    </div>
                    {rel.diluted_percentage !== null && (
                      <div className="flex items-baseline gap-1">
                        <span className="text-blue-700">Diluted</span>
                        <span className="font-semibold text-blue-900">{rel.diluted_percentage.toFixed(1)}%</span>
                      </div>
                    )}
                    {rel.acquisition_date && (
                      <div className="flex items-baseline gap-1">
                        <span className="text-blue-700">Acquired</span>
                        <span className="font-semibold text-blue-900">{new Date(rel.acquisition_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subsidiaries inline under ownership details */}
          {data.subsidiaries && data.subsidiaries.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Subsidiary Companies</h4>
              <div className="divide-y divide-gray-200 border border-gray-200">
                {data.subsidiaries.filter(rel => rel.child.name && rel.child.duns).map((rel) => (
                  <div key={`${rel.child.entity_id}-${rel.child.duns}`} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-semibold text-gray-900 text-sm">{rel.child.name}</h5>
                        <div className="flex gap-3 text-xs text-gray-600 mt-1">
                          <span>DUNS: <span className="font-mono">{rel.child.duns}</span></span>
                          <span>•</span>
                          <span>{rel.child.country}</span>
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <div>Financial Score</div>
                        <div className="text-base font-bold text-[#4BA82E]">{rel.child.financial_stability_score?.toFixed(1) ?? 'N/A'}</div>
                      </div>
                    </div>

                    {/* Flat ownership line */}
                    <div className="border border-blue-200 bg-blue-50 px-3 py-2 mb-2 text-xs">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <div className="flex items-baseline gap-1">
                          <span className="font-semibold text-blue-800">Ownership</span>
                          <span className="font-bold text-blue-900">{rel.ownership_percentage.toFixed(1)}%</span>
                        </div>
                        {rel.voting_rights !== null && (
                          <div className="flex items-baseline gap-1">
                            <span className="text-blue-700">Voting</span>
                            <span className="font-semibold text-blue-900">{rel.voting_rights.toFixed(1)}%</span>
                            {rel.has_special_voting_rights && <span className="text-blue-900">⭐</span>}
                          </div>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className="text-blue-700">Control</span>
                          <span className="font-semibold text-blue-900 capitalize">{rel.control_type}</span>
                        </div>
                        {rel.diluted_percentage !== null && (
                          <div className="flex items-baseline gap-1">
                            <span className="text-blue-700">Diluted</span>
                            <span className="font-semibold text-blue-900">{rel.diluted_percentage.toFixed(1)}%</span>
                          </div>
                        )}
                        {rel.acquisition_date && (
                          <div className="flex items-baseline gap-1">
                            <span className="text-blue-700">Acquired</span>
                            <span className="font-semibold text-blue-900">{new Date(rel.acquisition_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {rel.has_convertible_securities && (
                          <div className="flex items-baseline gap-1 text-orange-700">
                            <span>Convertible securities</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Ultimate Parent Info (if applicable) */}
      {data.ultimate_parent && (
        <div className="bg-white border border-gray-200">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800">Ultimate Parent Company</h3>
          </div>
          <div className="p-6">
            <p className="text-blue-900 font-bold text-xl">
              {data.ultimate_parent.name}
            </p>
            <p className="text-blue-700 text-base mt-1">
              {data.ultimate_parent.country}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom node types - using shared OwnershipNode component (MCOP-03G v2)
const nodeTypes = {
  ownershipNode: OwnershipNode,
};

/**
 * Build nodes and edges from ownership tree (recursive DFS)
 * Updated for MCOP-03G v2: Uses shared OwnershipNode component
 */
function buildGraphData(tree: OwnershipTree): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let nodeCounter = 0;

  function traverse(node: OwnershipTree, parentId: string | null, isRoot: boolean = false) {
    const nodeId = `${node.entity_id}_${nodeCounter++}`;

    // Clean company name using shared helper
    const companyName = cleanCompanyName(node.name);

    // Country is not in OwnershipTree, but is available in focal_entity/parent_companies/subsidiaries
    // For now, use empty string (backend bug tracked in memory - OWN-API-112)
    const countryCode = '';

    // Add node (single type now - OwnershipNode handles all variants)
    nodes.push({
      id: nodeId,
      type: 'ownershipNode',
      position: { x: 0, y: 0 }, // Will be set by calculateFlatLayout
      data: {
        depth: node.depth,
        company: companyName,
        country: countryCode,
        entity_id: node.entity_id,
        isRoot,
      },
    });

    // Add edge from parent
    if (parentId) {
      edges.push({
        id: `${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: 'straight', // Match supply chain edge type
        animated: false,
        style: { stroke: '#D1D5DB', strokeWidth: 1 }, // Neutral gray
      });
    }

    // Traverse subsidiaries (children)
    node.subsidiaries.forEach((child) => {
      traverse(child, nodeId, false);
    });
  }

  traverse(tree, null, true); // Start from root
  return { nodes, edges };
}
