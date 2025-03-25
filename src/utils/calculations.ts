
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
  const damArea = 0.5 * (dimensions.topWidth + dimensions.bottomWidth) * dimensions.height;
  
  // Calculate center of gravity (x-coordinate from toe)
  const damCG = (dimensions.bottomWidth * dimensions.bottomWidth + dimensions.topWidth * dimensions.bottomWidth + dimensions.topWidth * dimensions.topWidth) / 
                (3 * (dimensions.bottomWidth + dimensions.topWidth));
  
  // Calculate hydrostatic pressure area (triangular)
  const waterPressureArea = 0.5 * waterLevel * waterLevel;
  
  // Calculate forces
  const selfWeight = concreteUnitWeight * damVolume;
  
  // Calculate hydrostatic uplift if enabled
  const hydrostaticUplift = useUplift 
    ? waterUnitWeight * 0.5 * (upliftAtHeel + upliftAtToe) * dimensions.bottomWidth * dimensions.length
    : 0;
  
  // Calculate hydrostatic pressure force
  const hydrostaticPressureForce = waterUnitWeight * waterPressureArea * dimensions.length;
  
  // Calculate reactions
  const verticalReaction = selfWeight - hydrostaticUplift;
  const horizontalReaction = hydrostaticPressureForce;
  
  // Calculate moments
  const rightingMoment = selfWeight * damCG;
  
  // Calculate overturning moment
  const waterPressureMoment = hydrostaticPressureForce * (waterLevel / 3);
  const upliftMoment = useUplift ? hydrostaticUplift * (dimensions.bottomWidth / 2) : 0;
  const overturningMoment = waterPressureMoment + upliftMoment;
  
  // Calculate location of vertical reaction (from toe)
  const locationOfRy = (rightingMoment - overturningMoment) / verticalReaction;
  
  // Calculate factors of safety
  const factorOfSafetyAgainstSliding = (coefficientOfFriction * verticalReaction) / horizontalReaction;
  const factorOfSafetyAgainstOverturning = rightingMoment / overturningMoment;
  
  // Check stability criteria
  const isStable = 
    factorOfSafetyAgainstSliding >= 1.5 && 
    factorOfSafetyAgainstOverturning >= 1.5 && 
    locationOfRy >= 0 && 
    locationOfRy <= dimensions.bottomWidth;
  
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

export const formatNumber = (value: number): string => {
  return value.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
};

export const getUnitLabel = (parameter: string, unitSystem: 'SI' | 'English'): string => {
  const units: Record<string, Record<'SI' | 'English', string>> = {
    length: { SI: 'm', English: 'ft' },
    force: { SI: 'kN', English: 'lbf' },
    moment: { SI: 'kN·m', English: 'lbf·ft' },
    pressure: { SI: 'kN/m²', English: 'lbf/ft²' },
    unitWeight: { SI: 'kN/m³', English: 'lbf/ft³' },
    area: { SI: 'm²', English: 'ft²' },
    volume: { SI: 'm³', English: 'ft³' },
  };

  switch (parameter) {
    case 'height':
    case 'width':
    case 'length':
    case 'locationOfRy':
      return units.length[unitSystem];
    case 'selfWeight':
    case 'hydrostaticUplift':
    case 'hydrostaticPressureForce':
    case 'verticalReaction':
    case 'horizontalReaction':
      return units.force[unitSystem];
    case 'rightingMoment':
    case 'overturningMoment':
      return units.moment[unitSystem];
    case 'concreteUnitWeight':
    case 'waterUnitWeight':
      return units.unitWeight[unitSystem];
    default:
      return '';
  }
};
