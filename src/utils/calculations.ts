
import { DamParameters, CalculationResults } from "../types";

export const calculateResults = (params: DamParameters): CalculationResults => {
  // Extract parameters
  const {
    dimensions,
    concreteUnitWeight,
    waterUnitWeight,
    waterLevel,
    coefficientOfFriction,
    useUplift,
    upliftAtHeel = 0,
    upliftAtToe = 0,
    unitSystem
  } = params;

  // Calculate volume and areas
  const damVolume = 0.5 * (dimensions.topWidth + dimensions.bottomWidth) * dimensions.height * dimensions.length;
  
  // Calculate self-weight
  const selfWeight = damVolume * concreteUnitWeight;
  
  // Calculate hydrostatic pressure force
  const hydrostaticPressureForce = 0.5 * waterUnitWeight * waterLevel * waterLevel * dimensions.length;
  
  // Center of gravity calculation from heel using the universal formula for all shapes
  // Formula: CG = Base - (Base² + Base×Top + Top²) / (3 × (Base + Top))
  // This formula correctly handles all shapes:
  // - For rectangular dams (Base = Top): simplifies to Base/2
  // - For triangular/trapezoidal/curved/stepped dams: accounts for the varying cross-section
  const cgFromHeel = dimensions.bottomWidth - 
                    ((dimensions.bottomWidth * dimensions.bottomWidth + 
                      dimensions.bottomWidth * dimensions.topWidth + 
                      dimensions.topWidth * dimensions.topWidth) / 
                     (3 * (dimensions.bottomWidth + dimensions.topWidth)));
  
  // Calculate hydrostatic uplift if applicable
  let hydrostaticUplift = 0;
  let upliftMoment = 0;
  
  if (useUplift) {
    // Calculate trapezoidal uplift area
    const upliftArea = 0.5 * (upliftAtHeel + upliftAtToe) * dimensions.bottomWidth;
    hydrostaticUplift = waterUnitWeight * upliftArea * dimensions.length;
    
    // Calculate centroid of uplift pressure (from heel)
    // Using the simplified formula: 2/3 × Base
    const upliftCentroid = (2/3) * dimensions.bottomWidth;
    
    // Calculate uplift moment
    upliftMoment = hydrostaticUplift * upliftCentroid;
  }
  
  // Calculate moments
  const rightingMoment = selfWeight * cgFromHeel;
  const waterMoment = hydrostaticPressureForce * (waterLevel / 3);
  const overturningMoment = waterMoment + upliftMoment;
  
  // Calculate vertical and horizontal reactions
  const verticalReaction = selfWeight - (useUplift ? hydrostaticUplift : 0);
  const horizontalReaction = hydrostaticPressureForce;
  
  // Calculate location of resultant vertical force from heel
  const locationOfRy = (rightingMoment - overturningMoment) / verticalReaction;
  
  // Calculate factors of safety
  const factorOfSafetyAgainstSliding = (coefficientOfFriction * verticalReaction) / horizontalReaction;
  const factorOfSafetyAgainstOverturning = rightingMoment / overturningMoment;
  
  // Check if the dam is stable
  const isStable = factorOfSafetyAgainstSliding >= 1.5 && 
                  factorOfSafetyAgainstOverturning >= 1.5 && 
                  locationOfRy > 0 && 
                  locationOfRy < dimensions.bottomWidth;
  
  return {
    selfWeight,
    hydrostaticUplift: useUplift ? hydrostaticUplift : undefined,
    hydrostaticPressureForce,
    verticalReaction,
    horizontalReaction,
    rightingMoment,
    overturningMoment,
    locationOfRy,
    factorOfSafetyAgainstSliding,
    factorOfSafetyAgainstOverturning,
    isStable
  };
};

// Utility function for formatting numbers in the UI
export const formatNumber = (value: number): string => {
  if (Math.abs(value) < 0.01) return "0";
  return value.toFixed(2).replace(/\.00$/, '');
};

// Utility function for getting unit labels
export const getUnitLabel = (property: string, unitSystem: 'SI' | 'English'): string => {
  const unitLabels: Record<string, Record<'SI' | 'English', string>> = {
    width: { SI: 'm', English: 'ft' },
    height: { SI: 'm', English: 'ft' },
    length: { SI: 'm', English: 'ft' },
    area: { SI: 'm²', English: 'ft²' },
    volume: { SI: 'm³', English: 'ft³' },
    unitWeight: { SI: 'kN/m³', English: 'lbf/ft³' },
    selfWeight: { SI: 'kN', English: 'lbf' },
    hydrostaticPressureForce: { SI: 'kN', English: 'lbf' },
    hydrostaticUplift: { SI: 'kN', English: 'lbf' },
    verticalReaction: { SI: 'kN', English: 'lbf' },
    horizontalReaction: { SI: 'kN', English: 'lbf' },
    rightingMoment: { SI: 'kN·m', English: 'lbf·ft' },
    overturningMoment: { SI: 'kN·m', English: 'lbf·ft' },
    moment: { SI: 'kN·m', English: 'lbf·ft' },
    locationOfRy: { SI: 'm', English: 'ft' },
  };
  
  return unitLabels[property]?.[unitSystem] || '';
};

// Helper function to get CG explanation based on dam shape
// Returns an array of strings that can be mapped to JSX elements in the React component
export const getCGExplanationLines = (shape: string, bottomWidth: number, topWidth: number, unitSystem: 'SI' | 'English'): string[] => {
  // Universal formula explanation lines - apply this to ALL shapes without simplification
  const formulaLines = [
    `= Base - (Base² + Base×Top + Top²) / (3 × (Base + Top))`,
    `= ${formatNumber(bottomWidth)} - (${formatNumber(bottomWidth * bottomWidth + 
        bottomWidth * topWidth + 
        topWidth * topWidth)} / ${formatNumber(3 * (bottomWidth + topWidth))})`,
    `= ${formatNumber(bottomWidth - 
        ((bottomWidth * bottomWidth + 
          bottomWidth * topWidth + 
          topWidth * topWidth) / 
         (3 * (bottomWidth + topWidth))))} ${getUnitLabel('length', unitSystem)}`
  ];

  // We're not adding simplification notes for rectangular dams as requested
  return formulaLines;
};

// Helper function to get uplift centroid explanation
export const getUpliftCentroidExplanation = (bottomWidth: number, unitSystem: 'SI' | 'English'): string[] => {
  return [
    `Centroid = 2/3 × Base`,
    `= 2/3 × ${formatNumber(bottomWidth)}`,
    `= ${formatNumber((2/3) * bottomWidth)} ${getUnitLabel('length', unitSystem)}`
  ];
};
