
// Dam Input Types
export interface DamDimensions {
  height: number;
  topWidth: number;
  bottomWidth: number;
  length: number;
}

export interface DamParameters {
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

export interface SampleProblem {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  parameters: DamParameters;
  solution?: CalculationResults;
}

// App Navigation Types
export type AppView = 'calculator' | 'results' | 'learning' | 'sample-problems';
