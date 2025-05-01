import { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { ArrowLeft, User as UserIcon, Mail, Phone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface UserProfile {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  createdAt: string;
  lastLoginAt: Date;
}

const Profile = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    phoneNumber: ''
  });

  useEffect(() => {
    // Debug: Log auth state
    console.log('Auth state:', {
      currentUser,
      authLoading,
      authCurrentUser: auth.currentUser
    });

    if (currentUser) {
      try {
        console.log('User metadata:', {
          creationTime: currentUser.metadata.creationTime,
          lastSignInTime: currentUser.metadata.lastSignInTime
        });

        const creationTime = currentUser.metadata.creationTime 
          ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
          : new Date().toLocaleDateString();

        const lastSignInTime = currentUser.metadata.lastSignInTime
          ? new Date(currentUser.metadata.lastSignInTime)
          : new Date();

        const userProfile: UserProfile = {
          displayName: currentUser.displayName,
          email: currentUser.email,
          phoneNumber: currentUser.phoneNumber,
          photoURL: currentUser.photoURL,
          createdAt: creationTime,
          lastLoginAt: lastSignInTime
        };

        console.log('Setting profile:', userProfile);
        setProfile(userProfile);
        setEditForm({
          displayName: currentUser.displayName || '',
          phoneNumber: currentUser.phoneNumber || ''
        });
      } catch (error) {
        console.error('Error creating profile:', error);
        toast.error('Error loading profile data');
      }
    }
  }, [currentUser, authLoading]);

  // Update last login time every minute
  useEffect(() => {
    if (!profile) return;
    
    const interval = setInterval(() => {
      setProfile(prev => prev ? { ...prev } : null);
    }, 60000);
    
    return () => clearInterval(interval);
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (!currentUser) return;

    try {
      await updateProfile(currentUser, {
        displayName: editForm.displayName,
      });
      
      setProfile(prev => prev ? {
        ...prev,
        displayName: editForm.displayName
      } : null);
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  // Debug: Log render state
  console.log('Render state:', {
    authLoading,
    hasCurrentUser: !!currentUser,
    hasProfile: !!profile
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-ecampus-lightgray">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ecampus-green mx-auto"></div>
            <p className="mt-4">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-ecampus-lightgray">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-base sm:text-lg">Please log in to view your profile</p>
            <Link to="/login" className="mt-4 inline-block">
              <Button>Go to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-ecampus-lightgray">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ecampus-green mx-auto"></div>
            <p className="mt-4">Loading profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ecampus-lightgray">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6 sm:mb-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-all-300 flex items-center text-sm sm:text-base">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-border p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-ecampus-green flex items-center justify-center">
                  {profile.photoURL ? (
                    <img 
                      src={profile.photoURL} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-bold">{profile.displayName || 'User'}</h1>
                  <p className="text-sm sm:text-base text-muted-foreground">{profile.email}</p>
                </div>
              </div>
              <Button 
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto"
              >
                Edit Profile
              </Button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm sm:text-base">
                <div className="flex items-center gap-2 text-muted-foreground sm:w-32">
                  <Mail className="h-4 w-4" />
                  <span>Email:</span>
                </div>
                <span className="ml-6 sm:ml-0">{profile.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm sm:text-base">
                <div className="flex items-center gap-2 text-muted-foreground sm:w-32">
                  <Phone className="h-4 w-4" />
                  <span>Phone:</span>
                </div>
                <span className="ml-6 sm:ml-0">{profile.phoneNumber || 'Not provided'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm sm:text-base">
                <div className="flex items-center gap-2 text-muted-foreground sm:w-32">
                  <Calendar className="h-4 w-4" />
                  <span>Member since:</span>
                </div>
                <span className="ml-6 sm:ml-0">{profile.createdAt}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm sm:text-base">
                <div className="flex items-center gap-2 text-muted-foreground sm:w-32">
                  <Calendar className="h-4 w-4" />
                  <span>Last login:</span>
                </div>
                <span className="ml-6 sm:ml-0">{formatDistanceToNow(profile.lastLoginAt, { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={editForm.displayName}
                onChange={(e) => setEditForm(prev => ({
                  ...prev,
                  displayName: e.target.value
                }))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={editForm.phoneNumber}
                onChange={(e) => setEditForm(prev => ({
                  ...prev,
                  phoneNumber: e.target.value
                }))}
                disabled
                className="w-full bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Phone number can only be updated through phone authentication
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile} className="w-full sm:w-auto">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile; 