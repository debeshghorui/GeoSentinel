'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Bell,
  Shield,
  Satellite,
  Database,
  Globe,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Settings as SettingsIcon,
  Palette,
  Monitor,
  Moon,
  Sun,
  Zap,
  Clock,
  Target,
  Filter,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  location: string;
  bio: string;
  avatar: string;
}

interface NotificationSettings {
  emailAlerts: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  weeklyReports: boolean;
  systemUpdates: boolean;
  criticalOnly: boolean;
  soundEnabled: boolean;
  alertFrequency: string;
}

interface AnalysisSettings {
  defaultThreshold: number[];
  autoProcessing: boolean;
  retentionPeriod: string;
  imageQuality: string;
  changeDetectionSensitivity: number[];
  alertSeverityThresholds: {
    critical: number[];
    high: number[];
    medium: number[];
  };
}

interface SystemSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  units: string;
  autoSave: boolean;
  dataExportFormat: string;
  mapProvider: string;
  cacheSize: number[];
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Demo',
    email: 'john.demo@geosentinel.com',
    phone: '+1 (555) 123-4567',
    organization: 'Environmental Research Institute',
    role: 'Senior Analyst',
    location: 'San Francisco, CA',
    bio: 'Environmental scientist specializing in satellite imagery analysis and change detection for conservation projects.',
    avatar: '',
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailAlerts: true,
    pushNotifications: true,
    smsAlerts: false,
    weeklyReports: true,
    systemUpdates: true,
    criticalOnly: false,
    soundEnabled: true,
    alertFrequency: 'immediate',
  });

  const [analysis, setAnalysis] = useState<AnalysisSettings>({
    defaultThreshold: [15],
    autoProcessing: true,
    retentionPeriod: '12months',
    imageQuality: 'high',
    changeDetectionSensitivity: [75],
    alertSeverityThresholds: {
      critical: [25],
      high: [15],
      medium: [10],
    },
  });

  const [system, setSystem] = useState<SystemSettings>({
    language: 'en',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    units: 'metric',
    autoSave: true,
    dataExportFormat: 'geotiff',
    mapProvider: 'openstreetmap',
    cacheSize: [2048],
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('Profile updated successfully');
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('Notification settings updated');
  };

  const handleSaveAnalysis = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('Analysis settings updated');
  };

  const handleSaveSystem = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('System settings updated');
  };

  const handleExportSettings = () => {
    const settings = { profile, notifications, analysis, system };
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'geosentinel-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Settings exported successfully');
  };

  const handleResetSettings = () => {
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account, preferences, and system configuration
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleExportSettings}>
              <Download className="w-4 h-4 mr-2" />
              Export Settings
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Settings</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset all settings to their default values. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetSettings}>
                    Reset Settings
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.div>
      </div>

      {/* Settings Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center space-x-2">
              <Satellite className="w-4 h-4" />
              <span className="hidden sm:inline">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center space-x-2">
              <SettingsIcon className="w-4 h-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>Personal Information</span>
                    </CardTitle>
                    <CardDescription>
                      Update your personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organization">Organization</Label>
                        <Input
                          id="organization"
                          value={profile.organization}
                          onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          value={profile.role}
                          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        rows={3}
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="Tell us about yourself and your work..."
                      />
                    </div>
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                        />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Profile
                    </Button>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Security & Privacy</span>
                    </CardTitle>
                    <CardDescription>
                      Manage your account security and privacy settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Badge variant="outline" className="text-success border-success">
                          Enabled
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">API Access Key</h4>
                          <p className="text-sm text-muted-foreground">
                            Your personal API key for programmatic access
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            type={showApiKey ? 'text' : 'password'}
                            value="sk-1234567890abcdef"
                            readOnly
                            className="w-48"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Data Retention</h4>
                          <p className="text-sm text-muted-foreground">
                            How long we keep your analysis data
                          </p>
                        </div>
                        <Select defaultValue="12months">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3months">3 Months</SelectItem>
                            <SelectItem value="6months">6 Months</SelectItem>
                            <SelectItem value="12months">12 Months</SelectItem>
                            <SelectItem value="24months">24 Months</SelectItem>
                            <SelectItem value="indefinite">Indefinite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button variant="outline">
                        <Key className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                      <Button variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate API Key
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Picture & Quick Actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>
                      Upload a profile picture to personalize your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={profile.avatar} alt={profile.name} />
                        <AvatarFallback className="text-lg">
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Plan</span>
                      <Badge>Professional</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Storage Used</span>
                      <span className="text-sm">2.4 GB / 10 GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Calls</span>
                      <span className="text-sm">1,247 / 10,000</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Upgrade Plan
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Alert Preferences</span>
                  </CardTitle>
                  <CardDescription>
                    Configure how you receive alerts and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Email Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts via email
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailAlerts}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, emailAlerts: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Browser push notifications
                        </p>
                      </div>
                      <Switch
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, pushNotifications: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">SMS Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Critical alerts via SMS
                        </p>
                      </div>
                      <Switch
                        checked={notifications.smsAlerts}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, smsAlerts: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Sound Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Play sound for alerts
                        </p>
                      </div>
                      <Switch
                        checked={notifications.soundEnabled}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, soundEnabled: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Critical Only</Label>
                        <p className="text-sm text-muted-foreground">
                          Only receive critical alerts
                        </p>
                      </div>
                      <Switch
                        checked={notifications.criticalOnly}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, criticalOnly: checked })
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Alert Frequency</Label>
                    <Select
                      value={notifications.alertFrequency}
                      onValueChange={(value) =>
                        setNotifications({ ...notifications, alertFrequency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="hourly">Hourly Digest</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleSaveNotifications} disabled={isLoading}>
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Report Preferences</CardTitle>
                  <CardDescription>
                    Configure automated reports and summaries
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Weekly analysis summary
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, weeklyReports: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Platform updates and maintenance
                      </p>
                    </div>
                    <Switch
                      checked={notifications.systemUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, systemUpdates: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Report Format</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Report</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV Data</SelectItem>
                        <SelectItem value="json">JSON Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Delivery Time</Label>
                    <Select defaultValue="monday-9am">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday-9am">Monday 9:00 AM</SelectItem>
                        <SelectItem value="friday-5pm">Friday 5:00 PM</SelectItem>
                        <SelectItem value="sunday-12pm">Sunday 12:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analysis Settings */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Detection Thresholds</span>
                  </CardTitle>
                  <CardDescription>
                    Configure sensitivity and thresholds for change detection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Default Change Threshold</Label>
                    <div className="px-3">
                      <Slider
                        value={analysis.defaultThreshold}
                        onValueChange={(value) =>
                          setAnalysis({ ...analysis, defaultThreshold: value })
                        }
                        max={50}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>1%</span>
                        <span className="font-medium">{analysis.defaultThreshold[0]}%</span>
                        <span>50%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Detection Sensitivity</Label>
                    <div className="px-3">
                      <Slider
                        value={analysis.changeDetectionSensitivity}
                        onValueChange={(value) =>
                          setAnalysis({ ...analysis, changeDetectionSensitivity: value })
                        }
                        max={100}
                        min={25}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>Low</span>
                        <span className="font-medium">{analysis.changeDetectionSensitivity[0]}%</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-base">Alert Severity Thresholds</Label>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-destructive">Critical Alert Threshold</Label>
                        <div className="px-3">
                          <Slider
                            value={analysis.alertSeverityThresholds.critical}
                            onValueChange={(value) =>
                              setAnalysis({
                                ...analysis,
                                alertSeverityThresholds: {
                                  ...analysis.alertSeverityThresholds,
                                  critical: value,
                                },
                              })
                            }
                            max={50}
                            min={15}
                            step={1}
                            className="w-full"
                          />
                          <div className="text-center text-sm text-muted-foreground mt-1">
                            {analysis.alertSeverityThresholds.critical[0]}% change
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-orange-500">High Alert Threshold</Label>
                        <div className="px-3">
                          <Slider
                            value={analysis.alertSeverityThresholds.high}
                            onValueChange={(value) =>
                              setAnalysis({
                                ...analysis,
                                alertSeverityThresholds: {
                                  ...analysis.alertSeverityThresholds,
                                  high: value,
                                },
                              })
                            }
                            max={25}
                            min={10}
                            step={1}
                            className="w-full"
                          />
                          <div className="text-center text-sm text-muted-foreground mt-1">
                            {analysis.alertSeverityThresholds.high[0]}% change
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-yellow-500">Medium Alert Threshold</Label>
                        <div className="px-3">
                          <Slider
                            value={analysis.alertSeverityThresholds.medium}
                            onValueChange={(value) =>
                              setAnalysis({
                                ...analysis,
                                alertSeverityThresholds: {
                                  ...analysis.alertSeverityThresholds,
                                  medium: value,
                                },
                              })
                            }
                            max={15}
                            min={5}
                            step={1}
                            className="w-full"
                          />
                          <div className="text-center text-sm text-muted-foreground mt-1">
                            {analysis.alertSeverityThresholds.medium[0]}% change
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveAnalysis} disabled={isLoading}>
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Analysis Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Processing Options</span>
                  </CardTitle>
                  <CardDescription>
                    Configure automated processing and data handling
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Auto Processing</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically process uploaded images
                        </p>
                      </div>
                      <Switch
                        checked={analysis.autoProcessing}
                        onCheckedChange={(checked) =>
                          setAnalysis({ ...analysis, autoProcessing: checked })
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Data Retention Period</Label>
                    <Select
                      value={analysis.retentionPeriod}
                      onValueChange={(value) =>
                        setAnalysis({ ...analysis, retentionPeriod: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3months">3 Months</SelectItem>
                        <SelectItem value="6months">6 Months</SelectItem>
                        <SelectItem value="12months">12 Months</SelectItem>
                        <SelectItem value="24months">24 Months</SelectItem>
                        <SelectItem value="indefinite">Indefinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Image Quality</Label>
                    <Select
                      value={analysis.imageQuality}
                      onValueChange={(value) =>
                        setAnalysis({ ...analysis, imageQuality: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Faster processing)</SelectItem>
                        <SelectItem value="medium">Medium (Balanced)</SelectItem>
                        <SelectItem value="high">High (Best quality)</SelectItem>
                        <SelectItem value="ultra">Ultra (Maximum detail)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Processing Priority</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <input type="radio" name="priority" value="speed" defaultChecked />
                        <div>
                          <Label className="text-sm font-medium">Speed</Label>
                          <p className="text-xs text-muted-foreground">Faster processing, standard accuracy</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <input type="radio" name="priority" value="accuracy" />
                        <div>
                          <Label className="text-sm font-medium">Accuracy</Label>
                          <p className="text-xs text-muted-foreground">Higher accuracy, longer processing time</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Regional Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Configure language, timezone, and regional preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Language</Label>
                    <Select
                      value={system.language}
                      onValueChange={(value) =>
                        setSystem({ ...system, language: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Timezone</Label>
                    <Select
                      value={system.timezone}
                      onValueChange={(value) =>
                        setSystem({ ...system, timezone: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Date Format</Label>
                    <Select
                      value={system.dateFormat}
                      onValueChange={(value) =>
                        setSystem({ ...system, dateFormat: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        <SelectItem value="DD MMM YYYY">DD MMM YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Units</Label>
                    <Select
                      value={system.units}
                      onValueChange={(value) =>
                        setSystem({ ...system, units: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric (km, °C)</SelectItem>
                        <SelectItem value="imperial">Imperial (mi, °F)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="w-5 h-5" />
                    <span>Appearance</span>
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of your dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={theme === 'light' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme('light')}
                        className="flex items-center space-x-2"
                      >
                        <Sun className="w-4 h-4" />
                        <span>Light</span>
                      </Button>
                      <Button
                        variant={theme === 'dark' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme('dark')}
                        className="flex items-center space-x-2"
                      >
                        <Moon className="w-4 h-4" />
                        <span>Dark</span>
                      </Button>
                      <Button
                        variant={theme === 'system' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme('system')}
                        className="flex items-center space-x-2"
                      >
                        <Monitor className="w-4 h-4" />
                        <span>System</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Map Provider</Label>
                    <Select
                      value={system.mapProvider}
                      onValueChange={(value) =>
                        setSystem({ ...system, mapProvider: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openstreetmap">OpenStreetMap</SelectItem>
                        <SelectItem value="satellite">Satellite View</SelectItem>
                        <SelectItem value="terrain">Terrain</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Data Export Format</Label>
                    <Select
                      value={system.dataExportFormat}
                      onValueChange={(value) =>
                        setSystem({ ...system, dataExportFormat: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="geotiff">GeoTIFF</SelectItem>
                        <SelectItem value="shapefile">Shapefile</SelectItem>
                        <SelectItem value="kml">KML</SelectItem>
                        <SelectItem value="geojson">GeoJSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Auto-save</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically save changes
                      </p>
                    </div>
                    <Switch
                      checked={system.autoSave}
                      onCheckedChange={(checked) =>
                        setSystem({ ...system, autoSave: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5" />
                    <span>Performance</span>
                  </CardTitle>
                  <CardDescription>
                    Configure performance and caching settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Cache Size (MB)</Label>
                    <div className="px-3">
                      <Slider
                        value={system.cacheSize}
                        onValueChange={(value) =>
                          setSystem({ ...system, cacheSize: value })
                        }
                        max={8192}
                        min={512}
                        step={256}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>512 MB</span>
                        <span className="font-medium">{system.cacheSize[0]} MB</span>
                        <span>8 GB</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Performance Mode</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <input type="radio" name="performance" value="balanced" defaultChecked />
                        <div>
                          <Label className="text-sm font-medium">Balanced</Label>
                          <p className="text-xs text-muted-foreground">Optimal balance of speed and quality</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <input type="radio" name="performance" value="performance" />
                        <div>
                          <Label className="text-sm font-medium">Performance</Label>
                          <p className="text-xs text-muted-foreground">Prioritize speed over quality</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <input type="radio" name="performance" value="quality" />
                        <div>
                          <Label className="text-sm font-medium">Quality</Label>
                          <p className="text-xs text-muted-foreground">Prioritize quality over speed</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Cache
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center space-x-2">
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                          <span>Delete Account</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove all your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export All Data
                  </Button>
                </CardContent>
              </Card>

              <div className="lg:col-span-2">
                <Button onClick={handleSaveSystem} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save System Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}