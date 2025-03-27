
import { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import BikeCard, { BikeModel } from '@/components/BikeCard';
import LocationSelector, { locations } from '@/components/LocationSelector';

const bikeModels: BikeModel[] = [
  {
    id: 1,
    name: 'E-Bike Model 1',
    range: 20,
    price: 5,
    image: '/lovable-uploads/e3b8a797-c5bd-41b7-b4b4-cecaf605b323.png'
  },
  {
    id: 2,
    name: 'E-Bike Model 2',
    range: 25,
    price: 6,
    image: '/lovable-uploads/burghy.jpg'
  },
  {
    id: 3,
    name: 'Cardinal Cruiser',
    range: 30,
    price: 7,
    image: '/lovable-uploads/IMG_4723.jpeg'
  }
];

const Index = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <div className="min-h-screen bg-ecampus-lightgray overflow-hidden">
      <div 
        className="relative h-[70vh] bike-hero-bg flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <Navbar />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 transition-all duration-700 ease-out ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Rent an E-Bike for Easy Campus Travel
          </h1>
          <p 
            className={`text-xl text-white/90 max-w-2xl mx-auto mb-8 transition-all duration-700 delay-100 ease-out ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Get around campus quickly, sustainably, and enjoyably with our premium electric bikes
          </p>
          
          <div 
            className={`flex flex-col items-center transition-all duration-700 delay-200 ease-out ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <Button
              className="bg-ecampus-green hover:bg-ecampus-green/90 text-white rounded-full px-8 py-6 text-lg"
              onClick={() => {
                const element = document.getElementById('bike-selection');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Browse E-Bikes
            </Button>
            
            <ChevronDown 
              className="mt-8 h-10 w-10 text-white/70 animate-bounce cursor-pointer" 
              onClick={() => {
                const element = document.getElementById('bike-selection');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        </div>
      </div>
      
      <div id="bike-selection" className="py-24 container mx-auto px-4 bg-pattern-dots relative">
        <div className="absolute top-0 left-0 w-60 h-60 bg-ecampus-green/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-ecampus-green/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-4xl mx-auto mb-16 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12">Select Your Perfect Campus E-Bike</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <LocationSelector
              type="pickup"
              value={pickupLocation}
              onChange={setPickupLocation}
            />
            <LocationSelector
              type="dropoff"
              value={dropoffLocation}
              onChange={setDropoffLocation}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {bikeModels.map((bike, index) => (
            <div 
              key={bike.id} 
              className={`transition-all duration-700 ease-out delay-${index * 100} ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
            >
              <BikeCard bike={bike} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="py-24 bg-white bg-pattern-lines relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-64 bg-blur-gradient transform rotate-180"></div>
        <div className="absolute bottom-0 left-0 w-full h-64 bg-blur-gradient"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-16">Our Campus Stations</h2>
          
          <div className="relative aspect-video max-w-4xl mx-auto overflow-hidden rounded-2xl border border-border shadow-subtle">
            <img 
              src="/lovable-uploads/ebb52093-24a6-4846-8769-0b944b13ccc6.png" 
              alt="Campus Map" 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
      
      <footer className="bg-ecampus-black text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <img 
                src="/lovable-uploads/d989f7a3-1b27-4ce2-a62a-96b178e373a4.png" 
                alt="Campus Bike" 
                className="h-16 w-auto" 
              />
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400 mb-2">© 2023 Campus E-Bike. All rights reserved.</p>
              <p className="text-sm text-gray-400">Contact: campusbike@college.edu</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
