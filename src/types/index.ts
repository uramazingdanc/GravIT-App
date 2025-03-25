
// Dam Input Types
export interface DamDimensions {
  height: number;
  topWidth: number;
  bottomWidth: number;
  length: number;
}

export type DamShape = 'triangular' | 'rectangular' | 'stepped' | 'curved';

export interface DamParameters {
  shape: DamShape;
  dimensions: DamDimensions;
  concreteUnitWeight: number;
  waterUnitWeight: number;
  waterLevel: number;
  coefficientOfFriction: number;
  useUplift: boolean;
  upliftAtHeel?: number;
  upliftAtToe?: number;
  unitSystem: 'SI' | 'English';
}

// Calculation Result Types
export interface CalculationResults {
  selfWeight: number;
  hydrostaticUplift?: number;
  hydrostaticPressureForce: number;
  verticalReaction: number;
  horizontalReaction: number;
  rightingMoment: number;
  overturningMoment: number;
  locationOfRy: number;
  factorOfSafetyAgainstSliding: number;
  factorOfSafetyAgainstOverturning: number;
  isStable: boolean;
}

// Learning Module Types
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  duration?: string;
}

// App Navigation Types
export type AppView = 'home' | 'calculator' | 'results' | 'learning';
