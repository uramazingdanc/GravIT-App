
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { SampleProblem, DamParameters } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ArrowRight, Calculator, Book, Lightbulb } from 'lucide-react';

interface LearningModulesProps {
  onLoadSampleProblem: (params: DamParameters) => void;
}

const LearningModules: React.FC<LearningModulesProps> = ({ onLoadSampleProblem }) => {
  const [activeTab, setActiveTab] = useState('theory');
  
  const handleLoadProblem = (problem: SampleProblem) => {
    onLoadSampleProblem(problem.parameters);
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <Card className="glow-shadow">
        <CardHeader>
          <CardTitle className="text-2xl text-gravit-blue">Learning Center</CardTitle>
          <CardDescription>
            Browse through theoretical concepts and practical examples to master gravity dam calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full bg-gravit-gray mb-6">
              <TabsTrigger value="theory" className="flex items-center">
                <Book className="mr-2 h-4 w-4" />
                Theory
              </TabsTrigger>
              <TabsTrigger value="examples" className="flex items-center">
                <Calculator className="mr-2 h-4 w-4" />
                Examples
              </TabsTrigger>
              <TabsTrigger value="practice" className="flex items-center">
                <Lightbulb className="mr-2 h-4 w-4" />
                Practice Problems
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="theory" className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="gravity-dams">
                  <AccordionTrigger className="text-lg font-medium">
                    Introduction to Gravity Dams
                  </AccordionTrigger>
                  <AccordionContent className="text-base space-y-3">
                    <p>
                      Gravity dams are solid structures made of concrete or masonry that maintain their stability against design loads purely by their weight. 
                      A key characteristic of gravity dams is their triangular profile, with a wide base that helps resist the water pressure.
                    </p>
                    <p>
                      The primary forces acting on a gravity dam include:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>The weight of the dam itself</li>
                      <li>The hydrostatic pressure from the reservoir</li>
                      <li>Uplift pressure from water seeping under the dam</li>
                      <li>Earth or silt pressure</li>
                      <li>Wave pressure and ice pressure (in cold regions)</li>
                      <li>Earthquake forces in seismic zones</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="stability-analysis">
                  <AccordionTrigger className="text-lg font-medium">
                    Stability Analysis of Gravity Dams
                  </AccordionTrigger>
                  <AccordionContent className="text-base space-y-3">
                    <p>
                      Stability analysis of gravity dams involves checking against several potential failure modes:
                    </p>
                    <ol className="list-decimal list-inside space-y-3 ml-4">
                      <li>
                        <strong>Overturning</strong>: The dam must resist the tendency to rotate about its toe due to water pressure. We calculate this using moments:
                        <div className="bg-gray-100 p-3 rounded-md mt-2">
                          Factor of Safety against Overturning = Resisting Moment / Overturning Moment
                        </div>
                        <p className="mt-1">A factor of safety of at least 1.5 is typically required.</p>
                      </li>
                      <li>
                        <strong>Sliding</strong>: The dam must not slide horizontally along its foundation. This is calculated using:
                        <div className="bg-gray-100 p-3 rounded-md mt-2">
                          Factor of Safety against Sliding = (Coefficient of Friction × Vertical Forces) / Horizontal Forces
                        </div>
                        <p className="mt-1">A factor of safety of at least 1.2 is typically required.</p>
                      </li>
                      <li>
                        <strong>Stress Analysis</strong>: The stresses in the dam and at the dam-foundation interface must be within acceptable limits to prevent material failure.
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="dam-shapes">
                  <AccordionTrigger className="text-lg font-medium">
                    Types of Gravity Dam Shapes
                  </AccordionTrigger>
                  <AccordionContent className="text-base space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4 bg-white shadow-sm">
                        <h4 className="font-semibold text-gravit-blue">Triangular (Trapezoidal)</h4>
                        <p>The most common shape, with a wide base that tapers upward to efficiently resist water pressure and ensure stability.</p>
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-white shadow-sm">
                        <h4 className="font-semibold text-gravit-yellow">Rectangular</h4>
                        <p>A simpler design with a uniform cross-section, used in specific conditions where foundation stability is high.</p>
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-white shadow-sm">
                        <h4 className="font-semibold text-gravit-green">Step (Stepped)</h4>
                        <p>Features stepped faces on the downstream side to dissipate energy and reduce water impact forces.</p>
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-white shadow-sm">
                        <h4 className="font-semibold text-gravit-purple">Curved</h4>
                        <p>Slightly curved in plan view to add structural strength by utilizing arch action while still relying mainly on its weight.</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="calculations">
                  <AccordionTrigger className="text-lg font-medium">
                    Key Calculations and Formulas
                  </AccordionTrigger>
                  <AccordionContent className="text-base space-y-3">
                    <p>The main calculations involved in gravity dam analysis include:</p>
                    
                    <div className="space-y-3">
                      <div>
                        <strong>Self-weight of the dam:</strong>
                        <div className="bg-gray-100 p-3 rounded-md mt-1">
                          W = γ<sub>concrete</sub> × Volume
                        </div>
                        <p className="text-sm mt-1">Where γ<sub>concrete</sub> is the unit weight of concrete.</p>
                      </div>
                      
                      <div>
                        <strong>Hydrostatic pressure force:</strong>
                        <div className="bg-gray-100 p-3 rounded-md mt-1">
                          P = ½ × γ<sub>water</sub> × h<sup>2</sup> × b
                        </div>
                        <p className="text-sm mt-1">Where γ<sub>water</sub> is the unit weight of water, h is the height of water, and b is the unit length of the dam.</p>
                      </div>
                      
                      <div>
                        <strong>Uplift force (if applicable):</strong>
                        <div className="bg-gray-100 p-3 rounded-md mt-1">
                          U = γ<sub>water</sub> × Area of uplift diagram
                        </div>
                        <p className="text-sm mt-1">The uplift pressure distribution is typically trapezoidal, with maximum pressure at the heel and minimum at the toe.</p>
                      </div>
                      
                      <div>
                        <strong>Location of resultant vertical force:</strong>
                        <div className="bg-gray-100 p-3 rounded-md mt-1">
                          x = (Σ Moment about toe) / (Σ Vertical forces)
                        </div>
                        <p className="text-sm mt-1">For stability, the resultant should fall within the middle third of the base.</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            
            <TabsContent value="examples" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-gravit-blue">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Basic Stability Analysis</CardTitle>
                    <CardDescription>Triangular dam without uplift consideration</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>A simple triangular gravity dam with 30m height and 20m base width.</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Water level: 28m</li>
                      <li>Concrete unit weight: 23.5 kN/m³</li>
                      <li>Coefficient of friction: 0.75</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center"
                      onClick={() => handleLoadProblem({
                        id: "example1",
                        title: "Basic Stability Analysis",
                        difficulty: "Beginner",
                        description: "Triangular dam without uplift consideration",
                        parameters: {
                          shape: "triangular",
                          dimensions: {
                            height: 30,
                            topWidth: 5,
                            bottomWidth: 20,
                            length: 100,
                          },
                          concreteUnitWeight: 23.5,
                          waterUnitWeight: 9.81,
                          waterLevel: 28,
                          coefficientOfFriction: 0.75,
                          useUplift: false,
                          unitSystem: "SI",
                        }
                      })}
                    >
                      Try This Example <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border-l-4 border-l-gravit-yellow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Intermediate Dam Analysis</CardTitle>
                    <CardDescription>Rectangular dam with uplift forces</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>A rectangular gravity dam subjected to both water pressure and uplift forces.</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Water level: 25m</li>
                      <li>Uplift varies from 25m at heel to 0m at toe</li>
                      <li>Concrete unit weight: 24 kN/m³</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center"
                      onClick={() => handleLoadProblem({
                        id: "example2",
                        title: "Intermediate Dam Analysis",
                        difficulty: "Intermediate",
                        description: "Rectangular dam with uplift forces",
                        parameters: {
                          shape: "rectangular",
                          dimensions: {
                            height: 30,
                            topWidth: 15,
                            bottomWidth: 15,
                            length: 100,
                          },
                          concreteUnitWeight: 24,
                          waterUnitWeight: 9.81,
                          waterLevel: 25,
                          coefficientOfFriction: 0.70,
                          useUplift: true,
                          upliftAtHeel: 25,
                          upliftAtToe: 0,
                          unitSystem: "SI",
                        }
                      })}
                    >
                      Try This Example <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border-l-4 border-l-gravit-green">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Advanced Stability Assessment</CardTitle>
                    <CardDescription>Stepped dam with complex water profile</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>A stepped gravity dam with complex loading conditions and high water level.</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Water level: 35m (above dam height)</li>
                      <li>Uplift control measures installed</li>
                      <li>English unit system for calculations</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center"
                      onClick={() => handleLoadProblem({
                        id: "example3",
                        title: "Advanced Stability Assessment",
                        difficulty: "Advanced",
                        description: "Stepped dam with complex water profile",
                        parameters: {
                          shape: "stepped",
                          dimensions: {
                            height: 35,
                            topWidth: 8,
                            bottomWidth: 25,
                            length: 120,
                          },
                          concreteUnitWeight: 23.5,
                          waterUnitWeight: 9.81,
                          waterLevel: 32,
                          coefficientOfFriction: 0.65,
                          useUplift: true,
                          upliftAtHeel: 30,
                          upliftAtToe: 5,
                          unitSystem: "SI",
                        }
                      })}
                    >
                      Try This Example <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border-l-4 border-l-gravit-purple">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Custom Dam Configuration</CardTitle>
                    <CardDescription>Create your own problem parameters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Ready to test your own scenario? Go to the calculator and input custom values to analyze a dam of your design.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-gravit-blue hover:bg-gravit-lightBlue"
                      onClick={() => onLoadSampleProblem({
                        shape: "curved",
                        dimensions: {
                          height: 40,
                          topWidth: 10,
                          bottomWidth: 30,
                          length: 150,
                        },
                        concreteUnitWeight: 23.5,
                        waterUnitWeight: 9.81,
                        waterLevel: 35,
                        coefficientOfFriction: 0.70,
                        useUplift: false,
                        unitSystem: "SI",
                      })}
                    >
                      Try Custom Configuration <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="practice" className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-medium text-gravit-blue mb-3">Practice Problem Library</h3>
                <p className="text-gray-600 mb-4">
                  Our practice problem library is coming soon! You'll be able to test your skills with problems of varying difficulty.
                </p>
                <Button variant="outline" className="mr-4" disabled>
                  Beginner Problems
                </Button>
                <Button variant="outline" className="mr-4" disabled>
                  Intermediate Problems
                </Button>
                <Button variant="outline" disabled>
                  Advanced Problems
                </Button>
              </div>
              
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Pro Tip
                </h4>
                <p className="text-yellow-700 text-sm">
                  While waiting for our full problem library, you can practice by modifying the example problems or creating your own scenarios in the calculator.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningModules;
