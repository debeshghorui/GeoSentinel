'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Satellite,
  LayoutDashboard,
  Upload,
  Map,
  BarChart3,
  Download,
  Settings,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Bell,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

const navigationItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', badge: null },
  { icon: Upload, label: 'Upload', href: '/dashboard/upload', badge: null },
  { icon: Map, label: 'Map Viewer', href: '/dashboard/map', badge: null },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics', badge: '3' },
  { icon: Download, label: 'Downloads', href: '/dashboard/downloads', badge: null },
  { icon: Bell, label: 'Alerts', href: '/dashboard/alerts', badge: '2' },
];

const secondaryItems = [
  { icon: Settings, label: 'Settings', href: '/dashboard/settings', badge: null },
];

export default function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const NavigationItem = ({ item, isActive }: { item: any; isActive: boolean }) => {
    const content = (
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className={`w-full justify-start transition-all duration-200 ${
          collapsed ? 'px-2' : 'px-3'
        } ${isActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'hover:bg-muted/80'}`}
        onClick={() => router.push(item.href)}
      >
        <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Button>
    );

    if (collapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className={`fixed left-0 top-0 h-full bg-card border-r border-border z-40 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`p-4 ${collapsed ? 'px-2' : 'px-6'}`}>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-4 rounded-lg flex items-center justify-center flex-shrink-0">
              <Satellite className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="ml-3 text-lg font-bold">GeoSentinel</span>
            )}
          </div>
        </div>

        <Separator />

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
            />
          ))}

          <Separator className="my-4" />

          {secondaryItems.map((item) => (
            <NavigationItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </div>

        {/* Active Alerts Status */}
        {!collapsed && (
          <div className="p-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium">2 Active Alerts</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Critical changes detected in monitored areas
              </p>
            </div>
          </div>
        )}

        {/* Collapse Toggle */}
        <div className={`p-4 ${collapsed ? 'px-2' : ''}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleCollapse(!collapsed)}
            className="w-full"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}