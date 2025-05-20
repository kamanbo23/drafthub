import React, { useState } from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Brush
} from 'recharts';
import PlayerTooltip from './PlayerTooltip';

const ScatterPlotChart = ({ data, xKey, yKey, xLabel, yLabel }) => {
  // keep track of visible domain for the axes
  const [xDomain, setXDomain] = useState(null);
  const [yDomain, setYDomain] = useState(null);

  // update domains when user zooms or pans
  const handleZoom = (domain) => {
    setXDomain(domain.x);
    setYDomain(domain.y);
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        onMouseUp={(e) => {
          // simple implementation to prevent accidental clicks
          if (e && e.xAxisMap && e.xAxisMap[0]) {
            const domain = e.xAxisMap[0].domain;
            if (domain && domain.length === 2) {
              setXDomain(domain);
            }
          }
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          dataKey={xKey} 
          name={xLabel} 
          label={{ value: xLabel, position: 'bottom' }}
          domain={xDomain || ['auto', 'auto']}
          allowDataOverflow
        />
        <YAxis 
          type="number" 
          dataKey={yKey} 
          name={yLabel} 
          label={{ value: yLabel, angle: -90, position: 'left' }}
          domain={yDomain || ['auto', 'auto']}
          allowDataOverflow
        />
        <Tooltip content={<PlayerTooltip />} />
        <Scatter 
          name="Players" 
          data={data} 
          fill="#0053a0" 
          fillOpacity={0.8}
        />
        <Brush 
          dataKey={xKey} 
          height={30} 
          stroke="#0053a0"
          y={370}
          onChange={(e) => {
            if (e && e.startIndex !== undefined && e.endIndex !== undefined) {
              // update x-axis domain based on brush selection
              const filteredData = data.slice(e.startIndex, e.endIndex + 1);
              if (filteredData.length > 0) {
                const xValues = filteredData.map(d => d[xKey]);
                setXDomain([Math.min(...xValues), Math.max(...xValues)]);
              }
            }
          }}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterPlotChart; 