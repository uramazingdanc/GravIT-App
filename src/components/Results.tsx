
import React from 'react';
import { DamParameters, CalculationResults } from '@/types';
import { formatNumber, getUnitLabel } from '@/utils/calculations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, Check, ArrowDown } from 'lucide-react';

import DamVisualization from './DamVisualization';

interface ResultsProps {
  params: DamParameters;
  results: CalculationResults;
  onBackToCalculator: () => void;
}

const Results: React.FC<ResultsProps> = ({ params, results, onBackToCalculator }) => {
  const getSafetyIndicator = (value: number, threshold: number) => {
    if (value >= threshold * 1.5) {
      return <div className="flex items-center text-green-600"><Check size={16} className="mr-1" /> Excellent</div>;
    } else if (value >= threshold * 1.2) {
      return <div className="flex items-center text-green-500"><Check size={16} className="mr-1" /> Good</div>;
    } else if (value >= threshold) {
      return <div className="flex items-center text-amber-500"><ArrowUp size={16} className="mr-1" /> Acceptable</div>;
    } else {
      return <div className="flex items-center text-red-500"><ArrowDown size={16} className="mr-1" /> Inadequate</div>;
    }
  };

  const getProgressColor = (value: number, threshold: number) => {
    if (value >= threshold * 1.5) return 'bg-green-600';
    if (value >= threshold * 1.2) return 'bg-green-500';
    if (value >= threshold) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getProgressValue = (value: number, maxValue: number) => {
    return Math.min(100, (value / maxValue) * 100);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gravit-blue">Calculation Results</h2>
        <button
          onClick={onBackToCalculator}
          className="text-gravit-blue hover:text-gravit-darkBlue transition-colors underline"
        >
          Back to Calculator
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="section-header">Stability Analysis</h3>
            
            <div className="space-y-6 mt-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gravit-darkBlue">
                    Factor of Safety Against Sliding
                  </span>
                  <span className="text-sm font-medium">
                    {getSafetyIndicator(results.factorOfSafetyAgainstSliding, 1.5)}
                  </span>
                </div>
                <Progress 
                  value={getProgressValue(results.factorOfSafetyAgainstSliding, 3)} 
                  className="h-2"
                />
                <div className="flex justify-between mt-1 text-xs text-gravit-darkBlue">
                  <span>0</span>
                  <span>Required: 1.5</span>
                  <span>3.0</span>
                </div>
                <div className="mt-2 text-sm text-center font-medium">
                  {formatNumber(results.factorOfSafetyAgainstSliding)}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gravit-darkBlue">
                    Factor of Safety Against Overturning
                  </span>
                  <span className="text-sm font-medium">
                    {getSafetyIndicator(results.factorOfSafetyAgainstOverturning, 1.5)}
                  </span>
                </div>
                <Progress 
                  value={getProgressValue(results.factorOfSafetyAgainstOverturning, 3)} 
                  className="h-2"
                />
                <div className="flex justify-between mt-1 text-xs text-gravit-darkBlue">
                  <span>0</span>
                  <span>Required: 1.5</span>
                  <span>3.0</span>
                </div>
                <div className="mt-2 text-sm text-center font-medium">
                  {formatNumber(results.factorOfSafetyAgainstOverturning)}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gravit-darkBlue">
                    Location of Resultant from Heel
                  </span>
                  <span className="text-sm font-medium">
                    {results.locationOfRy > 0 && results.locationOfRy < params.dimensions.bottomWidth
                      ? <div className="flex items-center text-green-500"><Check size={16} className="mr-1" /> Within Base</div>
                      : <div className="flex items-center text-red-500"><ArrowDown size={16} className="mr-1" /> Outside Base</div>
                    }
                  </span>
                </div>
                <div className="h-6 w-full bg-gray-100 rounded-sm relative">
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                    style={{ left: 0 }}
                  ></div>
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                    style={{ right: 0 }}
                  ></div>
                  <div 
                    className={`absolute top-0 bottom-0 w-0.5 ${
                      results.locationOfRy > 0 && results.locationOfRy < params.dimensions.bottomWidth 
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                    }`}
                    style={{ 
                      left: `${Math.min(100, Math.max(0, (results.locationOfRy / params.dimensions.bottomWidth) * 100))}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gravit-darkBlue">
                  <span>Heel (0)</span>
                  <span>Middle Third</span>
                  <span>Toe ({formatNumber(params.dimensions.bottomWidth)} {getUnitLabel('width', params.unitSystem)})</span>
                </div>
                <div className="mt-2 text-sm text-center font-medium">
                  {formatNumber(results.locationOfRy)} {getUnitLabel('width', params.unitSystem)}
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-200">
                <div className="text-center">
                  <span className={`text-lg font-bold ${results.isStable ? 'text-green-500' : 'text-red-500'}`}>
                    {results.isStable ? 'Dam is Stable' : 'Dam is Unstable'}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    {results.isStable 
                      ? 'All safety criteria are met for both sliding and overturning stability.' 
                      : 'One or more safety criteria are not met. Review the design parameters.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <DamVisualization params={params} results={results} />
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="section-header">Detailed Results</h3>
          
          <Tabs defaultValue="forces" className="mt-4">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="forces">Forces</TabsTrigger>
              <TabsTrigger value="moments">Moments</TabsTrigger>
              <TabsTrigger value="reactions">Reactions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="forces" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="card p-4 bg-gravit-gray/30">
                  <div className="text-sm font-medium text-gravit-darkBlue">Self Weight</div>
                  <div className="text-xl font-bold text-gravit-blue mt-1">
                    {formatNumber(results.selfWeight)} {getUnitLabel('selfWeight', params.unitSystem)}
                  </div>
                </div>
                
                <div className="card p-4 bg-gravit-gray/30">
                  <div className="text-sm font-medium text-gravit-darkBlue">Hydrostatic Pressure</div>
                  <div className="text-xl font-bold text-gravit-blue mt-1">
                    {formatNumber(results.hydrostaticPressureForce)} {getUnitLabel('hydrostaticPressureForce', params.unitSystem)}
                  </div>
                </div>
                
                {params.useUplift && results.hydrostaticUplift !== undefined && (
                  <div className="card p-4 bg-gravit-gray/30 col-span-2">
                    <div className="text-sm font-medium text-gravit-darkBlue">Hydrostatic Uplift</div>
                    <div className="text-xl font-bold text-gravit-blue mt-1">
                      {formatNumber(results.hydrostaticUplift)} {getUnitLabel('hydrostaticUplift', params.unitSystem)}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gravit-darkBlue mb-2">Calculation Steps:</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Self Weight</strong> = Unit Weight of Concrete × Volume of Dam
                    <div className="text-gravit-darkBlue/70 ml-4">
                      = {params.concreteUnitWeight} {getUnitLabel('unitWeight', params.unitSystem)} × 
                      {formatNumber(0.5 * (params.dimensions.topWidth + params.dimensions.bottomWidth) * params.dimensions.height * params.dimensions.length)} {getUnitLabel('volume', params.unitSystem)}
                      = {formatNumber(results.selfWeight)} {getUnitLabel('selfWeight', params.unitSystem)}
                    </div>
                  </div>
                  
                  <div>
                    <strong>Hydrostatic Pressure Force</strong> = Unit Weight of Water × Pressure Area × Length
                    <div className="text-gravit-darkBlue/70 ml-4">
                      = {params.waterUnitWeight} {getUnitLabel('unitWeight', params.unitSystem)} × 
                      (0.5 × {params.waterLevel}² {getUnitLabel('area', params.unitSystem)}) × 
                      {params.dimensions.length} {getUnitLabel('length', params.unitSystem)}
                      = {formatNumber(results.hydrostaticPressureForce)} {getUnitLabel('hydrostaticPressureForce', params.unitSystem)}
                    </div>
                  </div>
                  
                  {params.useUplift && results.hydrostaticUplift !== undefined && (
                    <div>
                      <strong>Hydrostatic Uplift</strong> = Unit Weight of Water × Uplift Area × Length
                      <div className="text-gravit-darkBlue/70 ml-4">
                        = {params.waterUnitWeight} {getUnitLabel('unitWeight', params.unitSystem)} × 
                        (0.5 × ({params.upliftAtHeel} + {params.upliftAtToe}) × {params.dimensions.bottomWidth} {getUnitLabel('area', params.unitSystem)}) × 
                        {params.dimensions.length} {getUnitLabel('length', params.unitSystem)}
                        = {formatNumber(results.hydrostaticUplift)} {getUnitLabel('hydrostaticUplift', params.unitSystem)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="moments" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="card p-4 bg-gravit-gray/30">
                  <div className="text-sm font-medium text-gravit-darkBlue">Righting Moment</div>
                  <div className="text-xl font-bold text-gravit-blue mt-1">
                    {formatNumber(results.rightingMoment)} {getUnitLabel('rightingMoment', params.unitSystem)}
                  </div>
                </div>
                
                <div className="card p-4 bg-gravit-gray/30">
                  <div className="text-sm font-medium text-gravit-darkBlue">Overturning Moment</div>
                  <div className="text-xl font-bold text-gravit-blue mt-1">
                    {formatNumber(results.overturningMoment)} {getUnitLabel('overturningMoment', params.unitSystem)}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gravit-darkBlue mb-2">Calculation Steps:</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Center of Gravity (from heel)</strong>
                    <div className="text-gravit-darkBlue/70 ml-4">
                      {params.shape === "triangular" && params.dimensions.topWidth === 0 ? (
                        <>= Base/3 = {formatNumber(params.dimensions.bottomWidth / 3)} {getUnitLabel('length', params.unitSystem)}</>
                      ) : (
                        <>
                          = (Base² + Base×Top + Top²) / (3 × (Base + Top))
                          = {formatNumber((params.dimensions.bottomWidth * params.dimensions.bottomWidth + 
                              params.dimensions.topWidth * params.dimensions.bottomWidth + 
                              params.dimensions.topWidth * params.dimensions.topWidth) / 
                              (3 * (params.dimensions.topWidth + params.dimensions.bottomWidth)))} {getUnitLabel('length', params.unitSystem)}
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <strong>Righting Moment</strong> = Self Weight × Center of Gravity (from heel)
                    <div className="text-gravit-darkBlue/70 ml-4">
                      = {formatNumber(results.selfWeight)} {getUnitLabel('selfWeight', params.unitSystem)} × 
                      {formatNumber((params.dimensions.bottomWidth * params.dimensions.bottomWidth + 
                        params.dimensions.topWidth * params.dimensions.bottomWidth + 
                        params.dimensions.topWidth * params.dimensions.topWidth) / 
                        (3 * (params.dimensions.topWidth + params.dimensions.bottomWidth)))} {getUnitLabel('length', params.unitSystem)}
                      = {formatNumber(results.rightingMoment)} {getUnitLabel('rightingMoment', params.unitSystem)}
                    </div>
                  </div>
                  
                  <div>
                    <strong>Water Pressure Moment</strong> = Hydrostatic Pressure Force × (Water Level / 3)
                    <div className="text-gravit-darkBlue/70 ml-4">
                      = {formatNumber(results.hydrostaticPressureForce)} {getUnitLabel('hydrostaticPressureForce', params.unitSystem)} × 
                      ({params.waterLevel} / 3) {getUnitLabel('length', params.unitSystem)}
                      = {formatNumber(results.hydrostaticPressureForce * params.waterLevel / 3)} {getUnitLabel('rightingMoment', params.unitSystem)}
                    </div>
                  </div>
                  
                  {params.useUplift && results.hydrostaticUplift !== undefined && (
                    <div>
                      <strong>Uplift Moment (from heel)</strong> = Hydrostatic Uplift × Uplift Centroid
                      <div className="text-gravit-darkBlue/70 ml-4">
                        = {formatNumber(results.hydrostaticUplift)} {getUnitLabel('hydrostaticUplift', params.unitSystem)} × 
                        Centroid {getUnitLabel('length', params.unitSystem)}
                        = Computed based on trapezoidal pressure distribution from heel to toe
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <strong>Total Overturning Moment</strong> = Water Pressure Moment + Uplift Moment
                    <div className="text-gravit-darkBlue/70 ml-4">
                      = {formatNumber(results.hydrostaticPressureForce * params.waterLevel / 3)} {getUnitLabel('rightingMoment', params.unitSystem)} + 
                      {params.useUplift && results.hydrostaticUplift !== undefined 
                        ? " Uplift Moment"
                        : '0'
                      }
                      = {formatNumber(results.overturningMoment)} {getUnitLabel('overturningMoment', params.unitSystem)}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reactions" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="card p-4 bg-gravit-gray/30">
                  <div className="text-sm font-medium text-gravit-darkBlue">Vertical Reaction (Ry)</div>
                  <div className="text-xl font-bold text-gravit-blue mt-1">
                    {formatNumber(results.verticalReaction)} {getUnitLabel('verticalReaction', params.unitSystem)}
                  </div>
                </div>
                
                <div className="card p-4 bg-gravit-gray/30">
                  <div className="text-sm font-medium text-gravit-darkBlue">Horizontal Reaction (Rx)</div>
                  <div className="text-xl font-bold text-gravit-blue mt-1">
                    {formatNumber(results.horizontalReaction)} {getUnitLabel('horizontalReaction', params.unitSystem)}
                  </div>
                </div>
                
                <div className="card p-4 bg-gravit-gray/30 col-span-2">
                  <div className="text-sm font-medium text-gravit-darkBlue">Location of Ry (from heel)</div>
                  <div className="text-xl font-bold text-gravit-blue mt-1">
                    {formatNumber(results.locationOfRy)} {getUnitLabel('locationOfRy', params.unitSystem)}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gravit-darkBlue mb-2">Calculation Steps:</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Vertical Reaction (Ry)</strong> = Self Weight - Hydrostatic Uplift
                    <div className="text-gravit-darkBlue/70 ml-4">
                      = {formatNumber(results.selfWeight)} {getUnitLabel('selfWeight', params.unitSystem)} - 
                      {params.useUplift && results.hydrostaticUplift !== undefined 
                        ? `${formatNumber(results.hydrostaticUplift)} ${getUnitLabel('hydrostaticUplift', params.unitSystem)}`
                        : '0'
                      }
                      = {formatNumber(results.verticalReaction)} {getUnitLabel('verticalReaction', params.unitSystem)}
                    </div>
                  </div>
                  
                  <div>
                    <strong>Horizontal Reaction (Rx)</strong> = Hydrostatic Pressure Force
                    <div className="text-gravit-darkBlue/70 ml-4">
                      = {formatNumber(results.hydrostaticPressureForce)} {getUnitLabel('hydrostaticPressureForce', params.unitSystem)}
                    </div>
                  </div>
                  
                  <div>
                    <strong>Location of Ry (from heel)</strong> = (Righting Moment - Overturning Moment) / Vertical Reaction
                    <div className="text-gravit-darkBlue/70 ml-4">
                      = ({formatNumber(results.rightingMoment)} - {formatNumber(results.overturningMoment)}) {getUnitLabel('moment', params.unitSystem)} / 
                      {formatNumber(results.verticalReaction)} {getUnitLabel('verticalReaction', params.unitSystem)}
                      = {formatNumber(results.locationOfRy)} {getUnitLabel('locationOfRy', params.unitSystem)}
                    </div>
                  </div>
                  
                  <div>
                    <strong>Factor of Safety Against Sliding</strong> = (Coefficient of Friction × Vertical Reaction) / Horizontal Reaction
                    <div className="text-gravit-darkBlue/70 ml-4">
                      = ({params.coefficientOfFriction} × {formatNumber(results.verticalReaction)} {getUnitLabel('verticalReaction', params.unitSystem)}) / 
                      {formatNumber(results.horizontalReaction)} {getUnitLabel('horizontalReaction', params.unitSystem)}
                      = {formatNumber(results.factorOfSafetyAgainstSliding)}
                    </div>
                  </div>
                  
                  <div>
                    <strong>Factor of Safety Against Overturning</strong> = Righting Moment / Overturning Moment
                    <div className="text-gravit-darkBlue/70 ml-4">
                      = {formatNumber(results.rightingMoment)} {getUnitLabel('rightingMoment', params.unitSystem)} / 
                      {formatNumber(results.overturningMoment)} {getUnitLabel('overturningMoment', params.unitSystem)}
                      = {formatNumber(results.factorOfSafetyAgainstOverturning)}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Results;
