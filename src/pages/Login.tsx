
import { useState } from 'react';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authTab, setAuthTab] = useState('login');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would authenticate the user
    toast.success('Logged in successfully!');
    navigate('/');
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would register the user
    toast.success('Account created successfully!');
    setAuthTab('login');
  };
  
  return (
    <div className="min-h-screen bg-ecampus-lightgray">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-24">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-all-300 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Link>
          </div>
          
          <div className="bg-white border border-border rounded-lg p-8 shadow-subtle">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/8f70293c-7b8c-4305-a502-83b76070d08f.png" 
                alt="Ecampus Bike" 
                className="h-12 w-auto" 
              />
            </div>
            
            <Tabs defaultValue="login" value={authTab} onValueChange={setAuthTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-ecampus-green data-[state=active]:text-white">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-ecampus-green data-[state=active]:text-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="student@college.edu" 
                        className="w-full pl-10" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full pl-10" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-ecampus-green focus:ring-ecampus-green"
                      />
                      <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                        Remember me
                      </label>
                    </div>
                    
                    <div className="text-sm">
                      <a href="#" className="text-ecampus-green hover:text-ecampus-green/80">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-ecampus-green hover:bg-ecampus-green/90 text-white mt-6"
                  >
                    Sign In
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        className="w-full pl-10" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="student@college.edu" 
                        className="w-full pl-10" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signup-password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full pl-10" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-ecampus-green focus:ring-ecampus-green"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                      I agree to the{' '}
                      <a href="#" className="text-ecampus-green hover:text-ecampus-green/80">
                        Terms of Service
                      </a>
                    </label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-ecampus-green hover:bg-ecampus-green/90 text-white mt-6"
                  >
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;