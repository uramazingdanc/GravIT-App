
import React, { useRef, useEffect } from 'react';
import { DamParameters, CalculationResults } from '@/types';

interface DamVisualizationProps {
  params: DamParameters;
  results?: CalculationResults;
}

const DamVisualization: React.FC<DamVisualizationProps> = ({ params, results }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Scale factors to fit the dam shape in the canvas
    const maxHeight = params.dimensions.height;
    const maxWidth = Math.max(params.dimensions.bottomWidth, params.dimensions.topWidth);
    
    const margin = 40;
    const scaleX = (canvas.width - 2 * margin) / maxWidth;
    const scaleY = (canvas.height - 2 * margin) / maxHeight;
    const scale = Math.min(scaleX, scaleY);
    
    // Origin position (bottom left of the dam)
    const originX = margin;
    const originY = canvas.height - margin;
    
    // Dam dimensions
    const damHeight = params.dimensions.height * scale;
    const damBottomWidth = params.dimensions.bottomWidth * scale;
    const damTopWidth = params.dimensions.topWidth * scale;
    
    // Water level
    const waterLevel = params.waterLevel * scale;
    
    // Draw ground
    ctx.beginPath();
    ctx.strokeStyle = '#5D4037';
    ctx.fillStyle = '#8D6E63';
    ctx.moveTo(0, originY);
    ctx.lineTo(canvas.width, originY);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw dam
    ctx.beginPath();
    ctx.fillStyle = '#B0BEC5';
    ctx.strokeStyle = '#37474F';
    ctx.lineWidth = 2;
    
    // Dam shape (trapezoidal)
    ctx.moveTo(originX, originY); // Bottom left
    ctx.lineTo(originX + damBottomWidth, originY); // Bottom right
    ctx.lineTo(originX + damBottomWidth - (damBottomWidth - damTopWidth) / 2, originY - damHeight); // Top right
    ctx.lineTo(originX + (damBottomWidth - damTopWidth) / 2, originY - damHeight); // Top left
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw water
    ctx.beginPath();
    ctx.fillStyle = 'rgba(33, 150, 243, 0.5)';
    ctx.moveTo(0, originY - waterLevel);
    ctx.lineTo(originX + (damBottomWidth - damTopWidth) / 2, originY - waterLevel);
    
    // If water level is below dam height, draw water up to dam
    if (waterLevel < damHeight) {
      const waterHeightRatio = waterLevel / damHeight;
      const damWidthAtWaterLevel = damBottomWidth - (damBottomWidth - damTopWidth) * waterHeightRatio;
      const damLeftXAtWaterLevel = originX + (damBottomWidth - damWidthAtWaterLevel) / 2;
      
      ctx.lineTo(damLeftXAtWaterLevel, originY - waterLevel);
    } else {
      // If water overtops dam, draw water across the top
      ctx.lineTo(originX + (damBottomWidth - damTopWidth) / 2, originY - damHeight);
      ctx.lineTo(originX + damBottomWidth - (damBottomWidth - damTopWidth) / 2, originY - damHeight);
      ctx.lineTo(originX + damBottomWidth - (damBottomWidth - damTopWidth) / 2, originY - waterLevel);
    }
    
    ctx.lineTo(0, originY - waterLevel);
    ctx.closePath();
    ctx.fill();
    
    // Draw forces and moments if results exist
    if (results) {
      // Hydrostatic pressure force (horizontal arrow)
      const arrowLength = 50;
      const arrowY = originY - waterLevel / 2;
      
      ctx.beginPath();
      ctx.strokeStyle = '#F44336';
      ctx.fillStyle = '#F44336';
      ctx.lineWidth = 2;
      ctx.moveTo(0, arrowY);
      ctx.lineTo(originX - 10, arrowY);
      
      // Arrow head
      ctx.lineTo(originX - 10, arrowY - 8);
      ctx.lineTo(originX, arrowY);
      ctx.lineTo(originX - 10, arrowY + 8);
      ctx.lineTo(originX - 10, arrowY);
      
      ctx.stroke();
      ctx.fill();
      
      // Draw text label
      ctx.font = '12px Arial';
      ctx.fillStyle = '#F44336';
      ctx.fillText('Water Pressure', 5, arrowY - 12);
      
      // Self-weight force (vertical arrow)
      const centerX = originX + damBottomWidth / 2;
      const centerY = originY - damHeight / 2;
      
      ctx.beginPath();
      ctx.strokeStyle = '#4CAF50';
      ctx.fillStyle = '#4CAF50';
      ctx.lineWidth = 2;
      ctx.moveTo(centerX, centerY - 30);
      ctx.lineTo(centerX, centerY + 30);
      
      // Arrow head
      ctx.lineTo(centerX - 8, centerY + 20);
      ctx.lineTo(centerX, centerY + 30);
      ctx.lineTo(centerX + 8, centerY + 20);
      
      ctx.stroke();
      ctx.fill();
      
      // Draw text label
      ctx.font = '12px Arial';
      ctx.fillStyle = '#4CAF50';
      ctx.fillText('Self Weight', centerX + 10, centerY);
      
      // Draw uplift force if applicable
      if (params.useUplift && results.hydrostaticUplift) {
        const baseX = originX + damBottomWidth / 2;
        const baseY = originY;
        
        ctx.beginPath();
        ctx.strokeStyle = '#FF9800';
        ctx.fillStyle = '#FF9800';
        ctx.lineWidth = 2;
        ctx.moveTo(baseX, baseY);
        ctx.lineTo(baseX, baseY - 30);
        
        // Arrow head
        ctx.lineTo(baseX - 8, baseY - 20);
        ctx.lineTo(baseX, baseY - 30);
        ctx.lineTo(baseX + 8, baseY - 20);
        
        ctx.stroke();
        ctx.fill();
        
        // Draw text label
        ctx.font = '12px Arial';
        ctx.fillStyle = '#FF9800';
        ctx.fillText('Uplift', baseX + 10, baseY - 15);
      }
      
      // Draw stability indication
      const stabilityX = canvas.width - 100;
      const stabilityY = 40;
      
      ctx.font = 'bold 14px Arial';
      if (results.isStable) {
        ctx.fillStyle = '#4CAF50';
        ctx.fillText('STABLE', stabilityX, stabilityY);
      } else {
        ctx.fillStyle = '#F44336';
        ctx.fillText('UNSTABLE', stabilityX, stabilityY);
      }
    }
    
    // Draw annotations
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    
    // Dam height
    ctx.fillText(`Height: ${params.dimensions.height} ${params.unitSystem === 'SI' ? 'm' : 'ft'}`, 
                originX + damBottomWidth + 10, originY - damHeight / 2);
    
    // Base width
    ctx.fillText(`Base: ${params.dimensions.bottomWidth} ${params.unitSystem === 'SI' ? 'm' : 'ft'}`, 
                originX + damBottomWidth / 2, originY + 20);
    
    // Water level
    ctx.fillStyle = '#2196F3';
    ctx.fillText(`Water: ${params.waterLevel} ${params.unitSystem === 'SI' ? 'm' : 'ft'}`, 
                10, originY - waterLevel - 10);
    
  }, [params, results]);
  
  return (
    <div className="w-full mt-4 p-2 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gravit-darkBlue mb-2">Dam Visualization</h3>
      <canvas 
        ref={canvasRef} 
        className="w-full bg-white rounded border border-gray-200"
        width={500}
        height={300}
      />
      <p className="text-xs text-gray-500 mt-2">
        Note: Visualization not to scale. Forces and moments are for illustrative purposes.
      </p>
    </div>
  );
};

export default DamVisualization;
