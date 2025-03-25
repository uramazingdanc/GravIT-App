
import { DamShape } from '@/types';

export const damShapeDetails = {
  triangular: {
    name: 'Triangular (Trapezoidal)',
    description: 'The most common shape, with a wide base that tapers upward to efficiently resist water pressure and ensure stability.',
    color: 'border-gravit-blue',
  },
  rectangular: {
    name: 'Rectangular',
    description: 'A simpler design with a uniform cross-section, used in specific conditions where foundation stability is high.',
    color: 'border-gravit-yellow',
  },
  stepped: {
    name: 'Step (Stepped)',
    description: 'Features stepped faces on the downstream side to dissipate energy and reduce water impact forces.',
    color: 'border-gravit-green',
  },
  curved: {
    name: 'Curved',
    description: 'Slightly curved in plan view to add structural strength by utilizing arch action while still relying mainly on its weight.',
    color: 'border-gravit-purple',
  },
};

export const getDamShapeDescription = (shape: DamShape): string => {
  return damShapeDetails[shape]?.description || '';
};
