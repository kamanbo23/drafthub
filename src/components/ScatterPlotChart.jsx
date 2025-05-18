import React from 'react';
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
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          dataKey={xKey} 
          name={xLabel} 
          label={{ value: xLabel, position: 'bottom' }} 
        />
        <YAxis 
          type="number" 
          dataKey={yKey} 
          name={yLabel} 
          label={{ value: yLabel, angle: -90, position: 'left' }} 
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