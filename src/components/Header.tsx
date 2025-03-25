
import React from 'react';
import { Menu, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { AppView } from '@/types';

interface HeaderProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="bg-gravit-blue text-white py-2 px-4 sticky top-0 z-50 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/e8d87a91-6ea3-405b-b1fc-c6571fd80ca9.png" 
            alt="GravIT Logo" 
            className="h-12 w-auto cursor-pointer"
            onClick={() => setView('home')}
          />
        </div>
        
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            className={`text-white hover:bg-gravit-lightBlue ${currentView === 'home' ? 'bg-gravit-lightBlue' : ''}`}
            onClick={() => setView('home')}
          >
            <Home className="mr-1 h-4 w-4" />
            Home
          </Button>
          <Button 
            variant="ghost" 
            className={`text-white hover:bg-gravit-lightBlue ${currentView === 'calculator' ? 'bg-gravit-lightBlue' : ''}`}
            onClick={() => setView('calculator')}
          >
            Calculator
          </Button>
          <Button 
            variant="ghost" 
            className={`text-white hover:bg-gravit-lightBlue ${currentView === 'learning' ? 'bg-gravit-lightBlue' : ''}`}
            onClick={() => setView('learning')}
          >
            Learn
          </Button>
          <Button 
            variant="ghost" 
            className={`text-white hover:bg-gravit-lightBlue ${currentView === 'sample-problems' ? 'bg-gravit-lightBlue' : ''}`}
            onClick={() => setView('sample-problems')}
          >
            Examples
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
