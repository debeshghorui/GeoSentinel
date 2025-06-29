'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  HelpCircle,
  MessageCircle,
  Book,
  Video,
  FileText,
  Search,
  Send,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Download,
  Play,
  Users,
  Lightbulb,
  Zap,
  Shield,
  Globe,
  Headphones,
  Calendar,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';

const faqData = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'How do I upload satellite imagery for analysis?',
        answer: 'Navigate to the Upload page from the dashboard sidebar. You can drag and drop TIFF files or click to browse. Make sure to fill in the metadata fields including AOI name and analysis type before starting the analysis.',
      },
      {
        question: 'What file formats are supported?',
        answer: 'GeoSentinel supports TIFF (.tif, .tiff) files, which are the standard format for satellite imagery. We recommend using multi-band TIFF files for best results.',
      },
      {
        question: 'How long does analysis take?',
        answer: 'Analysis time depends on image size and complexity. Typically, it takes 2-10 minutes for standard LISS-4 imagery. You can monitor progress in the Analytics section.',
      },
    ],
  },
  {
    category: 'Change Detection',
    questions: [
      {
        question: 'How accurate is the change detection?',
        answer: 'Our AI-powered change detection achieves 94%+ accuracy on average. Accuracy varies based on image quality, temporal gap, and change type. You can adjust sensitivity thresholds in Settings.',
      },
      {
        question: 'What types of changes can be detected?',
        answer: 'GeoSentinel can detect vegetation loss, urban expansion, water body changes, agricultural modifications, and other land use changes. Each analysis type is optimized for specific change patterns.',
      },
      {
        question: 'How do I set up automated alerts?',
        answer: 'Go to the Alerts page and configure threshold-based monitoring for your AOIs. You can set different sensitivity levels and notification preferences for each area.',
      },
    ],
  },
  {
    category: 'Account & Billing',
    questions: [
      {
        question: 'How do I upgrade my plan?',
        answer: 'Contact our sales team or visit the billing section in your account settings. We offer Professional and Enterprise plans with different feature sets and usage limits.',
      },
      {
        question: 'What are API rate limits?',
        answer: 'API limits vary by plan: Starter (1,000 calls/month), Professional (10,000 calls/month), Enterprise (unlimited). Current usage is shown in your profile dashboard.',
      },
      {
        question: 'How is storage calculated?',
        answer: 'Storage includes uploaded imagery, processed results, and generated reports. Original images and analysis outputs count toward your storage quota.',
      },
    ],
  },
  {
    category: 'Technical Issues',
    questions: [
      {
        question: 'Why is my analysis failing?',
        answer: 'Common causes include corrupted files, unsupported formats, or insufficient image overlap. Check file integrity and ensure images cover the same geographical area.',
      },
      {
        question: 'How do I improve detection accuracy?',
        answer: 'Use high-quality images with minimal cloud cover, ensure proper temporal spacing (weeks to months), and adjust detection thresholds based on your specific use case.',
      },
      {
        question: 'Can I process historical imagery?',
        answer: 'Yes, GeoSentinel works with any TIFF satellite imagery regardless of acquisition date. Historical analysis helps establish baseline conditions and long-term trends.',
      },
    ],
  },
];

const supportChannels = [
  {
    name: 'Live Chat',
    description: 'Get instant help from our support team',
    availability: '24/7',
    responseTime: 'Immediate',
    icon: MessageCircle,
    action: 'Start Chat',
    color: 'bg-primary/10 text-primary',
  },
  {
    name: 'Email Support',
    description: 'Send detailed questions and get comprehensive answers',
    availability: 'Business Hours',
    responseTime: '< 4 hours',
    icon: Mail,
    action: 'Send Email',
    color: 'bg-chart-2/10 text-chart-2',
  },
  {
    name: 'Phone Support',
    description: 'Speak directly with our technical experts',
    availability: 'Mon-Fri 9AM-6PM PST',
    responseTime: 'Immediate',
    icon: Phone,
    action: 'Call Now',
    color: 'bg-chart-3/10 text-chart-3',
  },
  {
    name: 'Schedule Call',
    description: 'Book a dedicated session with our specialists',
    availability: 'By Appointment',
    responseTime: 'Scheduled',
    icon: Calendar,
    action: 'Book Call',
    color: 'bg-chart-4/10 text-chart-4',
  },
];

const resources = [
  {
    title: 'User Guide',
    description: 'Complete documentation for all features',
    type: 'Documentation',
    icon: Book,
    link: '#',
  },
  {
    title: 'Video Tutorials',
    description: 'Step-by-step video guides',
    type: 'Video',
    icon: Video,
    link: '#',
  },
  {
    title: 'API Documentation',
    description: 'Technical reference for developers',
    type: 'API',
    icon: FileText,
    link: '#',
  },
  {
    title: 'Best Practices',
    description: 'Tips for optimal results',
    type: 'Guide',
    icon: Lightbulb,
    link: '#',
  },
  {
    title: 'Webinar Recordings',
    description: 'Educational sessions and demos',
    type: 'Video',
    icon: Play,
    link: '#',
  },
  {
    title: 'Community Forum',
    description: 'Connect with other users',
    type: 'Community',
    icon: Users,
    link: '#',
  },
];

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: '',
    description: '',
  });
  const [activeTab, setActiveTab] = useState('faq');

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Support ticket submitted successfully! We\'ll get back to you soon.');
    setTicketForm({ subject: '', category: '', priority: '', description: '' });
  };

  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

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
            <h1 className="text-3xl font-bold">Help & Support</h1>
            <p className="text-muted-foreground">
              Get help, find answers, and connect with our support team
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Contact Support</DialogTitle>
                  <DialogDescription>
                    Choose how you'd like to get help
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  {supportChannels.map((channel) => (
                    <Button
                      key={channel.name}
                      variant="outline"
                      className="w-full justify-start h-auto p-4"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${channel.color}`}>
                        <channel.icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{channel.name}</p>
                        <p className="text-xs text-muted-foreground">{channel.responseTime}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </div>

      {/* Quick Support Channels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {supportChannels.map((channel, index) => (
          <Card key={channel.name} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${channel.color} group-hover:scale-110 transition-transform`}>
                  <channel.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{channel.name}</h3>
                  <p className="text-sm text-muted-foreground">{channel.responseTime}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{channel.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {channel.availability}
                </Badge>
                <Button size="sm" variant="ghost">
                  {channel.action}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="status">System Status</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-6">
                  {filteredFAQs.map((category) => (
                    <div key={category.category}>
                      <h3 className="text-lg font-semibold mb-3">{category.category}</h3>
                      <Accordion type="single" collapsible className="space-y-2">
                        {category.questions.map((faq, index) => (
                          <AccordionItem
                            key={index}
                            value={`${category.category}-${index}`}
                            className="border rounded-lg px-4"
                          >
                            <AccordionTrigger className="text-left hover:no-underline">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </div>

                {filteredFAQs.length === 0 && searchQuery && (
                  <div className="text-center py-8">
                    <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try different keywords or browse our resources
                    </p>
                    <Button variant="outline">
                      Contact Support
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <resource.icon className="w-5 h-5 text-primary" />
                        </div>
                        <Badge variant="outline">{resource.type}</Badge>
                      </div>
                      <h3 className="font-semibold mb-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                      <Button variant="ghost" size="sm" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Resource
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Featured Content */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Content</CardTitle>
                <CardDescription>
                  Popular guides and tutorials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Getting Started with Change Detection',
                      description: 'Complete guide to setting up your first analysis',
                      type: 'Tutorial',
                      duration: '15 min read',
                      popularity: 'Most Popular',
                    },
                    {
                      title: 'Optimizing Detection Accuracy',
                      description: 'Best practices for improving analysis results',
                      type: 'Guide',
                      duration: '10 min read',
                      popularity: 'Trending',
                    },
                    {
                      title: 'API Integration Walkthrough',
                      description: 'Step-by-step API implementation guide',
                      type: 'Technical',
                      duration: '20 min read',
                      popularity: 'Developer Favorite',
                    },
                  ].map((content, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Book className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{content.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {content.popularity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{content.description}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <Badge variant="outline" className="text-xs">{content.type}</Badge>
                          <span className="text-xs text-muted-foreground">{content.duration}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Ticket */}
              <Card>
                <CardHeader>
                  <CardTitle>Create Support Ticket</CardTitle>
                  <CardDescription>
                    Submit a detailed support request
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your issue"
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={ticketForm.category}
                          onValueChange={(value) => setTicketForm({ ...ticketForm, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="billing">Billing</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="account">Account</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={ticketForm.priority}
                          onValueChange={(value) => setTicketForm({ ...ticketForm, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        rows={6}
                        placeholder="Provide detailed information about your issue..."
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Ticket
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Recent Tickets */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Recent Tickets</CardTitle>
                  <CardDescription>
                    Track your support requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: 'TKT-001',
                        subject: 'Analysis not completing',
                        status: 'Open',
                        priority: 'High',
                        created: '2024-01-14T10:30:00Z',
                        updated: '2024-01-14T14:20:00Z',
                      },
                      {
                        id: 'TKT-002',
                        subject: 'API rate limit question',
                        status: 'Resolved',
                        priority: 'Medium',
                        created: '2024-01-12T09:15:00Z',
                        updated: '2024-01-12T16:45:00Z',
                      },
                      {
                        id: 'TKT-003',
                        subject: 'Feature request: Batch processing',
                        status: 'In Progress',
                        priority: 'Low',
                        created: '2024-01-10T11:20:00Z',
                        updated: '2024-01-13T08:30:00Z',
                      },
                    ].map((ticket) => (
                      <div key={ticket.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{ticket.id}</span>
                            <Badge
                              variant={
                                ticket.status === 'Open'
                                  ? 'destructive'
                                  : ticket.status === 'Resolved'
                                  ? 'default'
                                  : 'secondary'
                              }
                              className="text-xs"
                            >
                              {ticket.status}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                ticket.priority === 'High'
                                  ? 'border-destructive text-destructive'
                                  : ticket.priority === 'Medium'
                                  ? 'border-warning text-warning'
                                  : 'border-muted-foreground text-muted-foreground'
                              }`}
                            >
                              {ticket.priority}
                            </Badge>
                          </div>
                        </div>
                        <h4 className="font-medium mb-2">{ticket.subject}</h4>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Created {new Date(ticket.created).toLocaleDateString()}</span>
                          <span>Updated {new Date(ticket.updated).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Status Tab */}
          <TabsContent value="status" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span>System Status</span>
                  </CardTitle>
                  <CardDescription>
                    All systems operational
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { service: 'API Services', status: 'Operational', uptime: '99.9%' },
                    { service: 'Image Processing', status: 'Operational', uptime: '99.8%' },
                    { service: 'Web Dashboard', status: 'Operational', uptime: '100%' },
                    { service: 'Alert System', status: 'Operational', uptime: '99.9%' },
                    { service: 'Data Storage', status: 'Operational', uptime: '100%' },
                  ].map((service) => (
                    <div key={service.service} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="font-medium">{service.service}</span>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          {service.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{service.uptime} uptime</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Incidents */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Incidents</CardTitle>
                  <CardDescription>
                    Past 30 days incident history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: 'Scheduled Maintenance',
                        description: 'Database optimization and security updates',
                        status: 'Completed',
                        date: '2024-01-10T02:00:00Z',
                        duration: '2 hours',
                        impact: 'Low',
                      },
                      {
                        title: 'API Rate Limiting Issue',
                        description: 'Temporary increase in response times',
                        status: 'Resolved',
                        date: '2024-01-05T14:30:00Z',
                        duration: '45 minutes',
                        impact: 'Medium',
                      },
                    ].map((incident, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{incident.title}</h4>
                          <Badge
                            variant={incident.status === 'Completed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {incident.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{new Date(incident.date).toLocaleDateString()}</span>
                          <span>{incident.duration} • {incident.impact} impact</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Real-time system performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { metric: 'API Response Time', value: '245ms', status: 'good', icon: Zap },
                    { metric: 'Processing Queue', value: '12 jobs', status: 'normal', icon: Clock },
                    { metric: 'System Load', value: '68%', status: 'normal', icon: Activity },
                    { metric: 'Error Rate', value: '0.02%', status: 'good', icon: Shield },
                  ].map((metric) => (
                    <div key={metric.metric} className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <metric.icon className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-2xl font-bold mb-1">{metric.value}</p>
                      <p className="text-sm text-muted-foreground">{metric.metric}</p>
                      <Badge
                        variant="outline"
                        className={`mt-2 text-xs ${
                          metric.status === 'good'
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-warning/10 text-warning border-warning/20'
                        }`}
                      >
                        {metric.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}