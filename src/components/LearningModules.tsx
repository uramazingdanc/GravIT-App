
import React, { useState } from 'react';
import { LearningModule, SampleProblem, DamParameters } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { calculateResults } from '@/utils/calculations';

interface LearningModulesProps {
  onLoadSampleProblem: (params: DamParameters) => void;
}

const learningModules: LearningModule[] = [
  {
    id: 'intro',
    title: 'Introduction to Gravity Dams',
    description: 'Learn the fundamental concepts and principles behind gravity dam design.',
    duration: '10 min',
    content: (
      <div className="space-y-4">
        <p>
          Gravity dams are solid structures that maintain their stability against design loads primarily by means of their weight. 
          These massive concrete structures are designed to hold back large volumes of water by using their own weight to resist 
          the horizontal pressure of water pushing against the dam.
        </p>
        
        <h4 className="font-medium text-gravit-darkBlue mt-4">Key Characteristics:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Trapezoidal Cross-section:</strong> Typically wider at the base and narrower at the top to distribute pressure efficiently.
          </li>
          <li>
            <strong>Material:</strong> Usually constructed with concrete, sometimes with a rubble or masonry core.
          </li>
          <li>
            <strong>Stability Mechanism:</strong> Relies primarily on weight rather than structural strength.
          </li>
        </ul>
        
        <h4 className="font-medium text-gravit-darkBlue mt-4">Forces Acting on Gravity Dams:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Self-weight:</strong> The dam's own weight is the primary stabilizing force.
          </li>
          <li>
            <strong>Hydrostatic Pressure:</strong> Horizontal force exerted by water against the dam face.
          </li>
          <li>
            <strong>Uplift Pressure:</strong> Upward force due to water pressure under the dam foundation.
          </li>
          <li>
            <strong>External Loads:</strong> Including ice pressure, silt pressure, earthquake forces, etc.
          </li>
        </ul>
        
        <div className="mt-6 p-4 bg-gravit-gray rounded-lg">
          <h4 className="font-medium text-gravit-darkBlue">Important Design Considerations:</h4>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>The dam must resist overturning about the toe.</li>
            <li>It must resist sliding along any horizontal plane, particularly the foundation.</li>
            <li>It must resist crushing due to excessive compression.</li>
            <li>Settlement must be within acceptable limits.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'forces',
    title: 'Understanding Forces and Moments',
    description: 'Explore the various forces and moments that affect gravity dam stability.',
    duration: '15 min',
    content: (
      <div className="space-y-4">
        <h4 className="font-medium text-gravit-darkBlue">Hydrostatic Pressure</h4>
        <p>
          Hydrostatic pressure is the force exerted by water against the upstream face of the dam. It increases linearly with depth
          and acts perpendicular to the dam face at every point.
        </p>
        <div className="bg-gravit-gray rounded-lg p-3 my-3">
          <strong>Formula:</strong> P = γw × h
          <p className="text-sm text-gravit-darkBlue mt-1">
            Where P is pressure at depth h, γw is the unit weight of water, and h is the depth from water surface.
          </p>
        </div>
        <p>
          The total force due to hydrostatic pressure on a unit length of dam is equal to the area of the pressure diagram,
          which is triangular in shape for a vertical upstream face.
        </p>
        <div className="bg-gravit-gray rounded-lg p-3 my-3">
          <strong>Total Force:</strong> F = ½ × γw × H² × L
          <p className="text-sm text-gravit-darkBlue mt-1">
            Where H is the height of water and L is the length of the dam.
          </p>
        </div>
        
        <h4 className="font-medium text-gravit-darkBlue mt-6">Self-Weight</h4>
        <p>
          The self-weight of the dam is the primary stabilizing force that resists overturning and sliding.
          It depends on the volume of the dam and the unit weight of the material used.
        </p>
        <div className="bg-gravit-gray rounded-lg p-3 my-3">
          <strong>Formula:</strong> W = γc × V
          <p className="text-sm text-gravit-darkBlue mt-1">
            Where W is the weight, γc is the unit weight of concrete, and V is the volume of the dam section.
          </p>
        </div>
        
        <h4 className="font-medium text-gravit-darkBlue mt-6">Uplift Pressure</h4>
        <p>
          Uplift pressure is caused by water percolating under the dam foundation. It acts upward and reduces the effective weight of the dam.
        </p>
        <div className="bg-gravit-gray rounded-lg p-3 my-3">
          <strong>Uplift Force:</strong> U = (h₁ + h₂) / 2 × B × γw × L
          <p className="text-sm text-gravit-darkBlue mt-1">
            Where h₁ is the uplift head at heel, h₂ is the uplift head at toe, B is the base width, and L is the length.
          </p>
        </div>
        
        <h4 className="font-medium text-gravit-darkBlue mt-6">Moments</h4>
        <p>
          Moments cause rotation about a point (typically the toe of the dam) and are crucial for stability analysis.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <strong>Overturning Moment:</strong> Caused by horizontal forces like hydrostatic pressure trying to rotate the dam about its toe.
          </li>
          <li>
            <strong>Resisting Moment:</strong> Provided by the self-weight of the dam, counteracting the overturning moment.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'stability',
    title: 'Stability Analysis of Gravity Dams',
    description: 'Learn how to analyze and ensure the stability of gravity dam structures.',
    duration: '20 min',
    content: (
      <div className="space-y-4">
        <p>
          Stability analysis is critical in gravity dam design to ensure the structure can withstand all applied forces without failure.
          The primary stability criteria include resistance to overturning, sliding, and stress limitations.
        </p>
        
        <h4 className="font-medium text-gravit-darkBlue mt-4">1. Overturning Stability</h4>
        <p>
          Overturning stability ensures the dam will not rotate about its toe due to the lateral pressure of water.
        </p>
        <div className="bg-gravit-gray rounded-lg p-3 my-3">
          <strong>Factor of Safety Against Overturning:</strong> FSo = ΣMr / ΣMo
          <p className="text-sm text-gravit-darkBlue mt-1">
            Where ΣMr is the sum of resisting moments and ΣMo is the sum of overturning moments.
          </p>
          <p className="text-sm font-medium text-gravit-blue mt-2">
            For adequate stability, FSo should be at least 1.5.
          </p>
        </div>
        
        <h4 className="font-medium text-gravit-darkBlue mt-6">2. Sliding Stability</h4>
        <p>
          Sliding stability ensures the dam will not slide horizontally along its foundation or any horizontal plane.
        </p>
        <div className="bg-gravit-gray rounded-lg p-3 my-3">
          <strong>Factor of Safety Against Sliding:</strong> FSs = (f × ΣV) / ΣH
          <p className="text-sm text-gravit-darkBlue mt-1">
            Where f is the coefficient of friction, ΣV is the sum of vertical forces, and ΣH is the sum of horizontal forces.
          </p>
          <p className="text-sm font-medium text-gravit-blue mt-2">
            For adequate stability, FSs should be at least 1.5.
          </p>
        </div>
        
        <h4 className="font-medium text-gravit-darkBlue mt-6">3. Stress Analysis</h4>
        <p>
          Stress analysis ensures that compressive and tensile stresses in the dam are within permissible limits.
        </p>
        <div className="bg-gravit-gray rounded-lg p-3 my-3">
          <strong>Maximum Stress at Toe:</strong> σtoe = (ΣV / B) × (1 + 6e/B)
          <p className="text-sm text-gravit-darkBlue mt-1">
            Where ΣV is the sum of vertical forces, B is the base width, and e is the eccentricity.
          </p>
          <p className="text-sm font-medium text-gravit-blue mt-2">
            Compressive stress should not exceed the allowable stress for the material.
            Tensile stress is typically not permitted in conventional gravity dams.
          </p>
        </div>
        
        <h4 className="font-medium text-gravit-darkBlue mt-6">4. Location of Resultant</h4>
        <p>
          The resultant of all forces should fall within the middle third of the base for no tension to develop.
        </p>
        <div className="bg-gravit-gray rounded-lg p-3 my-3">
          <strong>Location of Resultant:</strong> x = (ΣMr - ΣMo) / ΣV
          <p className="text-sm text-gravit-darkBlue mt-1">
            Where x is the distance from the toe, ΣMr is the sum of resisting moments, ΣMo is the sum of overturning moments, and ΣV is the sum of vertical forces.
          </p>
          <p className="text-sm font-medium text-gravit-blue mt-2">
            For no tension to develop: B/3 ≤ x ≤ 2B/3, where B is the base width.
          </p>
        </div>
      </div>
    ),
  },
];

const sampleProblems: SampleProblem[] = [
  {
    id: 'sample1',
    title: 'Basic Gravity Dam Analysis',
    difficulty: 'Beginner',
    description: 'A simple gravity dam with a trapezoidal cross-section and basic loading conditions.',
    parameters: {
      dimensions: {
        height: 25,
        topWidth: 5,
        bottomWidth: 18,
        length: 100,
      },
      concreteUnitWeight: 23.5,
      waterUnitWeight: 9.81,
      waterLevel: 23,
      coefficientOfFriction: 0.7,
      useUplift: false,
      unitSystem: 'SI',
    }
  },
  {
    id: 'sample2',
    title: 'Dam with Hydrostatic Uplift',
    difficulty: 'Intermediate',
    description: 'A gravity dam analysis considering the effects of hydrostatic uplift pressure.',
    parameters: {
      dimensions: {
        height: 30,
        topWidth: 6,
        bottomWidth: 22,
        length: 100,
      },
      concreteUnitWeight: 23.5,
      waterUnitWeight: 9.81,
      waterLevel: 28,
      coefficientOfFriction: 0.75,
      useUplift: true,
      upliftAtHeel: 28,
      upliftAtToe: 0,
      unitSystem: 'SI',
    }
  },
  {
    id: 'sample3',
    title: 'High Dam with Critical Stability',
    difficulty: 'Advanced',
    description: 'A tall gravity dam with challenging stability conditions at the limit of safety factors.',
    parameters: {
      dimensions: {
        height: 45,
        topWidth: 8,
        bottomWidth: 35,
        length: 100,
      },
      concreteUnitWeight: 24.0,
      waterUnitWeight: 9.81,
      waterLevel: 42,
      coefficientOfFriction: 0.65,
      useUplift: true,
      upliftAtHeel: 42,
      upliftAtToe: 5,
      unitSystem: 'SI',
    }
  },
];

const LearningModules: React.FC<LearningModulesProps> = ({ onLoadSampleProblem }) => {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  
  const handleModuleClick = (moduleId: string) => {
    setActiveModuleId(activeModuleId === moduleId ? null : moduleId);
  };
  
  const handleLoadSampleProblem = (params: DamParameters) => {
    onLoadSampleProblem(params);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="modules">Learning Modules</TabsTrigger>
          <TabsTrigger value="examples">Sample Problems</TabsTrigger>
        </TabsList>
        
        <TabsContent value="modules" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {learningModules.map((module) => (
              <div key={module.id}>
                <Card className={`learning-card cursor-pointer transition-all ${activeModuleId === module.id ? 'shadow-md' : 'hover:shadow-md'}`}>
                  <CardHeader 
                    className="pb-2" 
                    onClick={() => handleModuleClick(module.id)}
                  >
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-gravit-blue">{module.title}</CardTitle>
                      {module.duration && (
                        <Badge variant="outline" className="bg-gravit-gray text-gravit-darkBlue">
                          {module.duration}
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  
                  {activeModuleId === module.id && (
                    <>
                      <CardContent className="pt-4">
                        {module.content}
                      </CardContent>
                      <CardFooter className="pt-2 flex justify-end">
                        <Button 
                          variant="ghost" 
                          className="text-gravit-blue hover:text-gravit-darkBlue hover:bg-gravit-gray"
                          onClick={() => handleModuleClick(module.id)}
                        >
                          Close
                        </Button>
                      </CardFooter>
                    </>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="examples" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            {sampleProblems.map((problem) => (
              <Card key={problem.id} className="hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-gravit-blue">{problem.title}</CardTitle>
                    <Badge 
                      className={
                        problem.difficulty === 'Beginner' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : problem.difficulty === 'Intermediate'
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }
                    >
                      {problem.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{problem.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gravit-darkBlue">Dam Height:</span>{' '}
                      {problem.parameters.dimensions.height} {problem.parameters.unitSystem === 'SI' ? 'm' : 'ft'}
                    </div>
                    <div>
                      <span className="font-medium text-gravit-darkBlue">Water Level:</span>{' '}
                      {problem.parameters.waterLevel} {problem.parameters.unitSystem === 'SI' ? 'm' : 'ft'}
                    </div>
                    <div>
                      <span className="font-medium text-gravit-darkBlue">Base Width:</span>{' '}
                      {problem.parameters.dimensions.bottomWidth} {problem.parameters.unitSystem === 'SI' ? 'm' : 'ft'}
                    </div>
                    <div>
                      <span className="font-medium text-gravit-darkBlue">Consider Uplift:</span>{' '}
                      {problem.parameters.useUplift ? 'Yes' : 'No'}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    className="bg-gravit-blue hover:bg-gravit-lightBlue"
                    onClick={() => handleLoadSampleProblem(problem.parameters)}
                  >
                    Load Problem
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningModules;
