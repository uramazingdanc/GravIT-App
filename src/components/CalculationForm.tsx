
import React, { useState, useEffect } from 'react';
import { DamParameters, DamShape } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { damShapeDetails } from '@/util/damShapes';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface CalculationFormProps {
  onCalculate: (params: DamParameters) => void;
  initialParams?: DamParameters;
}

const defaultParams: DamParameters = {
  shape: 'triangular',
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
  useUplift: true,
  upliftAtHeel: 28,
  upliftAtToe: 0,
  unitSystem: 'SI',
};

const CalculationForm: React.FC<CalculationFormProps> = ({ onCalculate, initialParams }) => {
  const [params, setParams] = useState<DamParameters>(initialParams || defaultParams);
  const [activeTab, setActiveTab] = useState<string>('shape');

  useEffect(() => {
    if (initialParams) {
      setParams(initialParams);
    }
  }, [initialParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setParams(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof DamParameters] as object,
          [child]: type === 'checkbox' 
            ? (e.target as HTMLInputElement).checked 
            : parseFloat(value) || 0,
        },
      }));
    } else {
      // Handle non-nested properties
      setParams(prev => ({
        ...prev,
        [name]: type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : parseFloat(value) || 0,
      }));
    }
  };

  const handleShapeChange = (value: string) => {
    setParams({
      ...params,
      shape: value as DamShape,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setParams({
      ...params,
      useUplift: checked,
    });
  };

  const handleUnitSystemChange = (value: string) => {
    // Convert values when switching unit systems
    const newParams = { ...params, unitSystem: value as 'SI' | 'English' };
    
    if (value === 'SI' && params.unitSystem === 'English') {
      // Convert from English to SI
      newParams.dimensions = {
        height: params.dimensions.height * 0.3048,
        topWidth: params.dimensions.topWidth * 0.3048,
        bottomWidth: params.dimensions.bottomWidth * 0.3048,
        length: params.dimensions.length * 0.3048,
      };
      newParams.concreteUnitWeight = params.concreteUnitWeight * 0.1571;
      newParams.waterUnitWeight = params.waterUnitWeight * 0.1571;
      newParams.waterLevel = params.waterLevel * 0.3048;
      if (params.upliftAtHeel) newParams.upliftAtHeel = params.upliftAtHeel * 0.3048;
      if (params.upliftAtToe) newParams.upliftAtToe = params.upliftAtToe * 0.3048;
    } else if (value === 'English' && params.unitSystem === 'SI') {
      // Convert from SI to English
      newParams.dimensions = {
        height: params.dimensions.height / 0.3048,
        topWidth: params.dimensions.topWidth / 0.3048,
        bottomWidth: params.dimensions.bottomWidth / 0.3048,
        length: params.dimensions.length / 0.3048,
      };
      newParams.concreteUnitWeight = params.concreteUnitWeight / 0.1571;
      newParams.waterUnitWeight = params.waterUnitWeight / 0.1571;
      newParams.waterLevel = params.waterLevel / 0.3048;
      if (params.upliftAtHeel) newParams.upliftAtHeel = params.upliftAtHeel / 0.3048;
      if (params.upliftAtToe) newParams.upliftAtToe = params.upliftAtToe / 0.3048;
    }
    
    setParams(newParams);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(params);
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in">
      <Card className="glow-shadow">
        <CardHeader>
          <CardTitle className="text-xl text-gravit-blue">Gravity Dam Calculator</CardTitle>
          <CardDescription>
            Enter parameters to analyze the stability of a gravity dam
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Unit System</h3>
                <div className="flex">
                  <Button
                    type="button"
                    size="sm"
                    variant={params.unitSystem === 'SI' ? 'default' : 'outline'}
                    className={`rounded-r-none ${params.unitSystem === 'SI' ? 'bg-gravit-blue' : ''}`}
                    onClick={() => handleUnitSystemChange('SI')}
                  >
                    SI
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={params.unitSystem === 'English' ? 'default' : 'outline'}
                    className={`rounded-l-none ${params.unitSystem === 'English' ? 'bg-gravit-blue' : ''}`}
                    onClick={() => handleUnitSystemChange('English')}
                  >
                    English
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="shape" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full bg-gravit-gray">
                  <TabsTrigger value="shape">Shape</TabsTrigger>
                  <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="conditions">Conditions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="shape" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <Label className="input-label">Dam Shape</Label>
                    <RadioGroup 
                      value={params.shape} 
                      onValueChange={handleShapeChange}
                      className="grid grid-cols-1 gap-2"
                    >
                      {Object.entries(damShapeDetails).map(([value, { name, description, color }]) => (
                        <label 
                          key={value}
                          className={`flex items-start space-x-2 p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${params.shape === value ? `${color} border-l-4` : 'border-gray-200'}`}
                        >
                          <RadioGroupItem value={value} id={`shape-${value}`} />
                          <div className="space-y-1">
                            <span className="font-medium block">{name}</span>
                            <span className="text-sm text-gray-500">{description}</span>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                </TabsContent>
                
                <TabsContent value="dimensions" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height" className="input-label">Dam Height</Label>
                      <div className="flex">
                        <Input
                          id="height"
                          name="dimensions.height"
                          type="number"
                          step="0.1"
                          value={params.dimensions.height}
                          onChange={handleChange}
                          className="input-field"
                          required
                        />
                        <span className="ml-2 flex items-center text-sm text-gravit-darkBlue">
                          {params.unitSystem === 'SI' ? 'm' : 'ft'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="topWidth" className="input-label">Top Width</Label>
                      <div className="flex">
                        <Input
                          id="topWidth"
                          name="dimensions.topWidth"
                          type="number"
                          step="0.1"
                          value={params.dimensions.topWidth}
                          onChange={handleChange}
                          className="input-field"
                          required
                        />
                        <span className="ml-2 flex items-center text-sm text-gravit-darkBlue">
                          {params.unitSystem === 'SI' ? 'm' : 'ft'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bottomWidth" className="input-label">Bottom Width</Label>
                      <div className="flex">
                        <Input
                          id="bottomWidth"
                          name="dimensions.bottomWidth"
                          type="number"
                          step="0.1"
                          value={params.dimensions.bottomWidth}
                          onChange={handleChange}
                          className="input-field"
                          required
                        />
                        <span className="ml-2 flex items-center text-sm text-gravit-darkBlue">
                          {params.unitSystem === 'SI' ? 'm' : 'ft'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="length" className="input-label">Dam Length</Label>
                      <div className="flex">
                        <Input
                          id="length"
                          name="dimensions.length"
                          type="number"
                          step="0.1"
                          value={params.dimensions.length}
                          onChange={handleChange}
                          className="input-field"
                          required
                        />
                        <span className="ml-2 flex items-center text-sm text-gravit-darkBlue">
                          {params.unitSystem === 'SI' ? 'm' : 'ft'}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="materials" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="concreteUnitWeight" className="input-label">Concrete Unit Weight</Label>
                      <div className="flex">
                        <Input
                          id="concreteUnitWeight"
                          name="concreteUnitWeight"
                          type="number"
                          step="0.01"
                          value={params.concreteUnitWeight}
                          onChange={handleChange}
                          className="input-field"
                          required
                        />
                        <span className="ml-2 flex items-center text-sm text-gravit-darkBlue">
                          {params.unitSystem === 'SI' ? 'kN/m³' : 'lbf/ft³'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="waterUnitWeight" className="input-label">Water Unit Weight</Label>
                      <div className="flex">
                        <Input
                          id="waterUnitWeight"
                          name="waterUnitWeight"
                          type="number"
                          step="0.01"
                          value={params.waterUnitWeight}
                          onChange={handleChange}
                          className="input-field"
                          required
                        />
                        <span className="ml-2 flex items-center text-sm text-gravit-darkBlue">
                          {params.unitSystem === 'SI' ? 'kN/m³' : 'lbf/ft³'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="coefficientOfFriction" className="input-label">Coefficient of Friction</Label>
                      <div className="flex">
                        <Input
                          id="coefficientOfFriction"
                          name="coefficientOfFriction"
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={params.coefficientOfFriction}
                          onChange={handleChange}
                          className="input-field"
                          required
                        />
                        <span className="ml-2 flex items-center text-sm text-gravit-darkBlue">
                          (unitless)
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="conditions" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="waterLevel" className="input-label">Water Level</Label>
                      <div className="flex">
                        <Input
                          id="waterLevel"
                          name="waterLevel"
                          type="number"
                          step="0.1"
                          value={params.waterLevel}
                          onChange={handleChange}
                          className="input-field"
                          required
                        />
                        <span className="ml-2 flex items-center text-sm text-gravit-darkBlue">
                          {params.unitSystem === 'SI' ? 'm' : 'ft'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="useUplift" className="input-label">Include Hydrostatic Uplift</Label>
                        <Switch
                          id="useUplift"
                          checked={params.useUplift}
                          onCheckedChange={handleSwitchChange}
                        />
                      </div>
                    </div>
                    
                    {params.useUplift && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="upliftAtHeel" className="input-label">Uplift at Heel</Label>
                          <div className="flex">
                            <Input
                              id="upliftAtHeel"
                              name="upliftAtHeel"
                              type="number"
                              step="0.1"
                              value={params.upliftAtHeel}
                              onChange={handleChange}
                              className="input-field"
                              required={params.useUplift}
                            />
                            <span className="ml-2 flex items-center text-sm text-gravit-darkBlue">
                              {params.unitSystem === 'SI' ? 'm' : 'ft'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="upliftAtToe" className="input-label">Uplift at Toe</Label>
                          <div className="flex">
                            <Input
                              id="upliftAtToe"
                              name="upliftAtToe"
                              type="number"
                              step="0.1"
                              value={params.upliftAtToe}
                              onChange={handleChange}
                              className="input-field"
                              required={params.useUplift}
                            />
                            <span className="ml-2 flex items-center text-sm text-gravit-darkBlue">
                              {params.unitSystem === 'SI' ? 'm' : 'ft'}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-between mt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    if (activeTab === 'shape') setActiveTab('dimensions');
                    else if (activeTab === 'dimensions') setActiveTab('materials');
                    else if (activeTab === 'materials') setActiveTab('conditions');
                  }}
                  disabled={activeTab === 'conditions'}
                >
                  Next
                </Button>
                
                <Button 
                  type="submit" 
                  className="bg-gravit-blue hover:bg-gravit-lightBlue"
                >
                  Calculate
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculationForm;
