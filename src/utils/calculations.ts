
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
  
  // Center of gravity calculation from heel
  let cgFromHeel;
  
  switch(params.shape) {
    case "rectangular":
      cgFromHeel = dimensions.bottomWidth / 2;
      break;
    
    case "triangular":
      // For a triangular dam, CG is at 1/3 of the base from the heel
      if (dimensions.topWidth === 0) {
        cgFromHeel = dimensions.bottomWidth / 3;
      } else {
        // For a trapezoidal dam (triangular with top width > 0)
        cgFromHeel = (dimensions.bottomWidth * dimensions.bottomWidth + dimensions.bottomWidth * dimensions.topWidth + dimensions.topWidth * dimensions.topWidth) / 
                     (3 * (dimensions.bottomWidth + dimensions.topWidth));
      }
      break;
    
    case "stepped":
      // Approximate as trapezoidal for CG calculation
      cgFromHeel = (dimensions.bottomWidth * dimensions.bottomWidth + dimensions.bottomWidth * dimensions.topWidth + dimensions.topWidth * dimensions.topWidth) / 
                   (3 * (dimensions.bottomWidth + dimensions.topWidth));
      break;
      
    case "curved":
      // Approximate as trapezoidal for CG calculation
      cgFromHeel = (dimensions.bottomWidth * dimensions.bottomWidth + dimensions.bottomWidth * dimensions.topWidth + dimensions.topWidth * dimensions.topWidth) / 
                   (3 * (dimensions.bottomWidth + dimensions.topWidth));
      break;
      
    default:
      // Default to trapezoidal formula
      cgFromHeel = (dimensions.bottomWidth * dimensions.bottomWidth + dimensions.bottomWidth * dimensions.topWidth + dimensions.topWidth * dimensions.topWidth) / 
                   (3 * (dimensions.bottomWidth + dimensions.topWidth));
  }
  
  // Calculate hydrostatic uplift if applicable
  let hydrostaticUplift = 0;
  let upliftMoment = 0;
  
  if (useUplift) {
    // Calculate trapezoidal uplift area
    const upliftArea = 0.5 * (upliftAtHeel + upliftAtToe) * dimensions.bottomWidth;
    hydrostaticUplift = waterUnitWeight * upliftArea * dimensions.length;
    
    // Calculate centroid of uplift pressure (from heel)
    const upliftCentroid = dimensions.bottomWidth * (2 * upliftAtHeel + upliftAtToe) / (3 * (upliftAtHeel + upliftAtToe));
    
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
