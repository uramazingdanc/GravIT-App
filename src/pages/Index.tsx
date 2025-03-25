
import React, { useState } from 'react';
import Header from '@/components/Header';
import CalculationForm from '@/components/CalculationForm';
import Results from '@/components/Results';
import LearningModules from '@/components/LearningModules';
import { DamParameters, CalculationResults, AppView } from '@/types';
import { calculateResults } from '@/utils/calculations';

const Index = () => {
  const [appView, setAppView] = useState<AppView>('calculator');
  const [damParams, setDamParams] = useState<DamParameters | null>(null);
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);

  const handleCalculate = (params: DamParameters) => {
    const results = calculateResults(params);
    setDamParams(params);
    setCalculationResults(results);
    setAppView('results');
  };

  const handleBackToCalculator = () => {
    setAppView('calculator');
  };

  const handleLoadSampleProblem = (params: DamParameters) => {
    setDamParams(params);
    setAppView('calculator');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header currentView={appView} setView={setAppView} />
      
      <main className="flex-1 container py-6 px-4 animate-fade-in">
        {appView === 'calculator' && (
          <CalculationForm 
            onCalculate={handleCalculate} 
            initialParams={damParams || undefined}
          />
        )}
        
        {appView === 'results' && damParams && calculationResults && (
          <Results 
            params={damParams} 
            results={calculationResults}
            onBackToCalculator={handleBackToCalculator}
          />
        )}
        
        {appView === 'learning' && (
          <LearningModules onLoadSampleProblem={handleLoadSampleProblem} />
        )}
        
        {appView === 'sample-problems' && (
          <div className="flex justify-center items-center h-96">
            <p className="text-lg text-center text-gray-500">Sample problem library coming soon!</p>
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        GravIT - Master Gravity Dam Calculations, Anytime, Anywhere!
      </footer>
    </div>
  );
};

export default Index;
