'use client';

import React, { useState, useEffect, useRef } from 'react';

// Design Tokens (Glassmorphic & Cyberpunk Dark theme)
const COLORS = {
  bg: '#f8f9fa',
  panel: '#ffffff',
  border: '#e5e7eb',
  textPrimary: '#111111',
  textSecondary: '#555555',
  verified: '#10b981',
  tampered: '#ef4444',
  suspended: '#f59e0b',
  unverified: '#6b7280',
};

interface Node {
  id: string;
  type: 'user' | 'agent' | 'merchant' | 'issuer' | 'network';
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Edge {
  source: string;
  target: string;
  mandateId: string;
  status: 'verified' | 'unverified' | 'tampered' | 'expired' | 'suspended';
  signerKeyId: string;
  amount: number;
}

export default function TrustGraphWidget({ data }: { data?: any }) {
  // Use data passed from the tool output or fall back to default demo data
  const initialNodes: Node[] = data?.nodes?.map((n: any, idx: number) => ({
    ...n,
    x: 150 + idx * 120,
    y: 200 + (idx % 2 === 0 ? 40 : -40),
    vx: 0,
    vy: 0,
  })) || [
    { id: 'node-user', type: 'user', label: 'End User', x: 100, y: 200, vx: 0, vy: 0 },
    { id: 'node-agent', type: 'agent', label: 'AI Shopping Agent', x: 250, y: 160, vx: 0, vy: 0 },
    { id: 'node-merchant', type: 'merchant', label: 'Online Merchant', x: 400, y: 240, vx: 0, vy: 0 },
    { id: 'node-issuer', type: 'issuer', label: 'Payment Gateway', x: 550, y: 160, vx: 0, vy: 0 },
    { id: 'node-network', type: 'network', label: 'Clearing Network', x: 700, y: 200, vx: 0, vy: 0 },
  ];

  const initialEdges: Edge[] = data?.edges || [
    { source: 'node-user', target: 'node-agent', mandateId: 'mandate-intent-xxx', status: 'verified', signerKeyId: 'key-agent-1', amount: 250 },
    { source: 'node-agent', target: 'node-merchant', mandateId: 'mandate-cart-xxx', status: 'tampered', signerKeyId: 'key-agent-1', amount: 25000 },
    { source: 'node-merchant', target: 'node-issuer', mandateId: 'mandate-payment-xxx', status: 'unverified', signerKeyId: 'key-issuer-gw', amount: 250 },
    { source: 'node-issuer', target: 'node-network', mandateId: 'mandate-clearing-xxx', status: 'verified', signerKeyId: 'key-issuer-gw', amount: 250 },
  ];

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const draggedNodeRef = useRef<string | null>(null);

  // Sync dynamic data if parent passes new props
  useEffect(() => {
    if (data?.nodes) {
      setNodes((prev) => {
        return data.nodes.map((n: any, idx: number) => {
          const existing = prev.find((p) => p.id === n.id);
          if (existing) {
            return { ...existing, ...n, x: existing.x, y: existing.y, vx: existing.vx, vy: existing.vy };
          }
          return {
            ...n,
            x: 150 + idx * 120,
            y: 200 + (idx % 2 === 0 ? 40 : -40),
            vx: 0,
            vy: 0,
          };
        });
      });
    }
    if (data?.edges) {
      setEdges(data.edges);
    }
  }, [data]);

  // Simulating lightweight spring forces for physics simulation
  useEffect(() => {
    setMounted(true);
    let animationFrameId: number;

    const tick = () => {
      setNodes((prevNodes) => {
        const nextNodes = prevNodes.map((n) => ({ ...n }));

        // Apply springs between edges
        edges.forEach((edge) => {
          const sNode = nextNodes.find((n) => n.id === edge.source);
          const tNode = nextNodes.find((n) => n.id === edge.target);

          if (sNode && tNode) {
            const dx = tNode.x - sNode.x;
            const dy = tNode.y - sNode.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const targetDist = 180;
            const force = (dist - targetDist) * 0.005;

            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            sNode.vx += fx;
            sNode.vy += fy;
            tNode.vx -= fx;
            tNode.vy -= fy;
          }
        });

        // Apply repulsion between all node pairs
        for (let i = 0; i < nextNodes.length; i++) {
          for (let j = i + 1; j < nextNodes.length; j++) {
            const n1 = nextNodes[i];
            const n2 = nextNodes[j];

            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < 220) {
              const force = (220 - dist) * 0.01;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;

              n1.vx -= fx;
              n1.vy -= fy;
              n2.vx += fx;
              n2.vy += fy;
            }
          }
        }

        // Apply center gravity and update positions
        const width = containerRef.current?.clientWidth || 800;
        const height = containerRef.current?.clientHeight || 400;

        return nextNodes.map((n) => {
          if (n.id === draggedNodeRef.current) {
            n.vx = 0;
            n.vy = 0;
            return n;
          }

          // Gravity to center line
          n.vy += (height / 2 - n.y) * 0.01;
          n.vx += (width / 2 - n.x) * 0.002;

          // Apply velocity and damping
          n.x += n.vx;
          n.y += n.vy;
          n.vx *= 0.85;
          n.vy *= 0.85;

          // Bound limits
          n.x = Math.max(50, Math.min(width - 50, n.x));
          n.y = Math.max(50, Math.min(height - 50, n.y));

          return n;
        });
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [edges]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'user': return '#3b82f6'; // Blue
      case 'agent': return '#a855f7'; // Purple
      case 'merchant': return '#ec4899'; // Pink
      case 'issuer': return '#06b6d4'; // Cyan
      case 'network': return '#10b981'; // Green
      default: return '#9ca3af';
    }
  };

  const getEdgeColor = (status: string) => {
    switch (status) {
      case 'verified': return COLORS.verified;
      case 'tampered': return COLORS.tampered;
      case 'suspended': return COLORS.suspended;
      default: return COLORS.unverified;
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: COLORS.bg,
        color: COLORS.textPrimary,
        fontFamily: 'Inter, system-ui, sans-serif',
        minHeight: '640px',
        padding: '24px',
        borderRadius: '16px',
        border: `1px solid ${COLORS.border}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow Backdrop removed for flat aesthetic */}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', zIndex: 1, position: 'relative' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: COLORS.textPrimary }}>
            [ TrustMesh Live Mandate Chain ]
          </h2>
          <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '4px 0 0 0' }}>
            Interactive cryptographic verification visualization
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: COLORS.textSecondary }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS.verified }} /> Verified
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: COLORS.textSecondary }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS.tampered }} /> Tampered
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: COLORS.textSecondary }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS.suspended }} /> Suspended
          </div>
        </div>
      </div>

      {/* SVG Trust Network Graph */}
      <svg 
        ref={svgRef}
        style={{ width: '100%', height: '500px', zIndex: 1, position: 'relative', border: `1px solid ${COLORS.border}`, borderRadius: '12px', backgroundColor: '#ffffff' }}
        onMouseMove={(e) => {
          if (draggedNodeRef.current && svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setNodes(prev => prev.map(n => n.id === draggedNodeRef.current ? { ...n, x, y, vx: 0, vy: 0 } : n));
          }
        }}
        onMouseUp={() => { draggedNodeRef.current = null; }}
        onMouseLeave={() => { draggedNodeRef.current = null; }}
      >
        {/* Draw edges/links */}
        {edges.map((edge, idx) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);

          if (!sourceNode || !targetNode) return null;

          const isSelected = selectedEdge?.mandateId === edge.mandateId;
          const isTampered = edge.status === 'tampered';

          return (
            <g key={idx} onClick={() => { setSelectedEdge(edge); setSelectedNode(null); }} style={{ cursor: 'pointer' }}>
              <line
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={getEdgeColor(edge.status)}
                strokeWidth={isSelected ? 4 : 2}
                strokeDasharray={isTampered || edge.status === 'suspended' ? '5,5' : 'none'}
                opacity={hoveredNode && hoveredNode !== edge.source && hoveredNode !== edge.target ? 0.3 : 1}
                style={{ transition: 'stroke-width 0.2s, opacity 0.2s' }}
              />
              {/* Pulse ripple for dynamic transaction clearing flow */}
              {mounted && (
                <circle
                  cx={sourceNode.x + (targetNode.x - sourceNode.x) * ((Date.now() % 4000) / 4000)}
                  cy={sourceNode.y + (targetNode.y - sourceNode.y) * ((Date.now() % 4000) / 4000)}
                  r="4"
                  fill={getEdgeColor(edge.status)}
                  opacity={0.8}
                />
              )}
            </g>
          );
        })}

        {/* Draw Nodes */}
        {nodes.map((node) => {
          const isHovered = hoveredNode === node.id;
          const isSelected = selectedNode?.id === node.id;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onMouseDown={(e) => { 
                e.preventDefault();
                draggedNodeRef.current = node.id;
                setSelectedNode(node); 
                setSelectedEdge(null); 
              }}
              style={{ cursor: 'grab', transition: 'transform 0.1s' }}
            >
              <circle
                r={isHovered || isSelected ? 22 : 18}
                fill="#ffffff"
                stroke={getNodeColor(node.type)}
                strokeWidth="3"
                style={{
                  transition: 'r 0.2s, stroke-width 0.2s'
                }}
              />
              <text
                dy=".3em"
                textAnchor="middle"
                fill="#111111"
                fontSize="10px"
                fontWeight="800"
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              >
                {node.type.substring(0, 3).toUpperCase()}
              </text>
              <text
                y="35"
                textAnchor="middle"
                fill={COLORS.textSecondary}
                fontSize="11px"
                fontWeight="500"
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Info Details Panel */}
      <div style={{
        marginTop: '16px',
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        zIndex: 2,
        position: 'relative'
      }}>
        {selectedEdge ? (
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: getEdgeColor(selectedEdge.status), fontWeight: 700 }}>
              Mandate Link Details ({selectedEdge.status.toUpperCase()})
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
              <div><strong>Mandate ID:</strong> <code style={{ color: '#ec4899' }}>{selectedEdge.mandateId}</code></div>
              <div><strong>Signer Key ID:</strong> <code style={{ color: '#06b6d4' }}>{selectedEdge.signerKeyId}</code></div>
              <div><strong>Transaction Value:</strong> {selectedEdge.amount} INR</div>
              <div><strong>Verification Result:</strong> {selectedEdge.status === 'verified' ? 'PASS (Valid signature)' : 'FAIL / UNAUTHORIZED'}</div>
            </div>
          </div>
        ) : selectedNode ? (
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: getNodeColor(selectedNode.type), fontWeight: 700 }}>
              Node Entity Details ({selectedNode.type.toUpperCase()})
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
              <div><strong>Name:</strong> {selectedNode.label}</div>
              <div><strong>Node ID:</strong> <code style={{ color: '#a855f7' }}>{selectedNode.id}</code></div>
              <div><strong>Status:</strong> Active / Clearing Allowed</div>
            </div>
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: '12px', color: COLORS.textSecondary, textAlign: 'center' }}>
            Click on any node or connection link in the trust network graph to inspect cryptographic details and transaction mandates
          </p>
        )}
      </div>
    </div>
  );
}
