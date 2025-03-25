
import React from 'react';
import { Button } from "@/components/ui/button";
import { AppView } from '@/types';
import { Dam, Book, Calculator, FileDigit } from 'lucide-react';

interface HomePageProps {
  setView: (view: AppView) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setView }) => {
  return (
    <div className="space-y-8 py-4 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gravit-blue mb-4">Welcome to GravIT</h1>
        <p className="text-gravit-darkBlue max-w-lg mx-auto">
          Your complete solution for gravity dam calculations and hydraulic engineering learning
        </p>
      </div>

      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gravit-darkBlue mb-4">Required Inputs</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Shape of Dam (Triangular, Rectangular, Stepped, or Curved)</li>
          <li>Unit of Measurement (S.I. or English)</li>
          <li>Dam Parameters and dimensions</li>
          <li>Optional: Hydrostatic uplift (heel, toe) to identify the area of force</li>
        </ul>
      </div>

      <div className="max-w-lg mx-auto">
        <h2 className="text-xl font-semibold text-gravit-darkBlue mb-4">Types of Gravity Dam Shapes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gravit-blue">
            <h3 className="font-semibold text-lg">Triangular (Trapezoidal)</h3>
            <p className="text-sm text-gray-600 mt-1">
              The most common shape, with a wide base that tapers upward to efficiently resist water pressure and ensure stability.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gravit-yellow">
            <h3 className="font-semibold text-lg">Rectangular</h3>
            <p className="text-sm text-gray-600 mt-1">
              A simpler design with a uniform cross-section, used in specific conditions where foundation stability is high.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gravit-green">
            <h3 className="font-semibold text-lg">Step (Stepped)</h3>
            <p className="text-sm text-gray-600 mt-1">
              Features stepped faces on the downstream side to dissipate energy and reduce water impact forces.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gravit-purple">
            <h3 className="font-semibold text-lg">Curved</h3>
            <p className="text-sm text-gray-600 mt-1">
              Slightly curved in plan view to add structural strength by utilizing arch action while still relying mainly on its weight.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto mt-8">
        <h2 className="text-xl font-semibold text-gravit-darkBlue mb-4">Get Started</h2>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            className="w-full h-24 flex flex-col items-center justify-center space-y-2 bg-gravit-blue hover:bg-gravit-lightBlue"
            onClick={() => setView('calculator')}
          >
            <Calculator size={24} />
            <span>Start Calculating</span>
          </Button>
          
          <Button 
            className="w-full h-24 flex flex-col items-center justify-center space-y-2 bg-gravit-blue hover:bg-gravit-lightBlue"
            onClick={() => setView('learning')}
          >
            <Book size={24} />
            <span>Learning Modules</span>
          </Button>
          
          <Button 
            className="w-full h-24 flex flex-col items-center justify-center space-y-2 bg-gravit-blue hover:bg-gravit-lightBlue"
            onClick={() => setView('sample-problems')}
          >
            <FileDigit size={24} />
            <span>Sample Problems</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
