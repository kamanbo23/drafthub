import React, { useState } from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
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
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterPlotChart; 