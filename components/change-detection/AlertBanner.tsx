'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  X, 
  Bell, 
  Clock, 
  MapPin, 
  TrendingUp,
  ExternalLink,
  Eye
} from 'lucide-react';
import { useState } from 'react';
import { getAlertThresholds } from '@/lib/config';

interface AlertData {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  changePercent: number;
  aoiName?: string;
  coordinates?: [number, number];
  threshold?: number;
  actions?: {
    label: string;
    action: () => void;
    variant?: 'default' | 'destructive' | 'outline';
  }[];
}

interface AlertBannerProps {
  alerts: AlertData[];
  onDismiss?: (alertId: string) => void;
  onDismissAll?: () => void;
  maxVisible?: number;
  autoHide?: boolean;
  autoHideDelay?: number;
  className?: string;
}

export default function AlertBanner({
  alerts,
  onDismiss,
  onDismissAll,
  maxVisible = 3,
  autoHide = false,
  autoHideDelay = 5000,
  className = ""
}: AlertBannerProps) {
  const thresholds = getAlertThresholds();
  const WARNING_THRESHOLD = thresholds.warning;
  const CRITICAL_THRESHOLD = thresholds.critical;
  
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const visibleAlerts = alerts
    .filter(alert => !dismissedAlerts.has(alert.id))
    .slice(0, maxVisible);

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...Array.from(prev), alertId]));
    onDismiss?.(alertId);
  };

  const handleDismissAll = () => {
    setDismissedAlerts(new Set(alerts.map(a => a.id)));
    onDismissAll?.();
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5" />;
      case 'warning':
        return <Bell className="w-5 h-5" />;
      case 'info':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'info':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (visibleAlerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`space-y-3 ${className}`}
    >
      {/* Alert Counter & Actions */}
      {alerts.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="destructive" className="animate-pulse">
              {alerts.filter(a => !dismissedAlerts.has(a.id)).length} Active Alerts
            </Badge>
            {alerts.filter(a => a.type === 'critical' && !dismissedAlerts.has(a.id)).length > 0 && (
              <Badge variant="destructive">
                {alerts.filter(a => a.type === 'critical' && !dismissedAlerts.has(a.id)).length} Critical
              </Badge>
            )}
          </div>
          
          {visibleAlerts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismissAll}
              className="text-xs"
            >
              Dismiss All
            </Button>
          )}
        </div>
      )}

      {/* Alert List */}
      <AnimatePresence mode="popLayout">
        {visibleAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              scale: 1,
              transition: { delay: index * 0.1 }
            }}
            exit={{ 
              opacity: 0, 
              x: 20, 
              scale: 0.95,
              transition: { duration: 0.2 }
            }}
            layout
            className="relative"
          >
            <Alert 
              variant={getAlertVariant(alert.type) as any}
              className={`
                ${alert.type === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : ''}
                ${alert.type === 'warning' ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' : ''}
                relative overflow-hidden
              `}
            >
              {/* Animated accent bar for critical alerts */}
              {alert.type === 'critical' && (
                <motion.div
                  className="absolute left-0 top-0 w-1 h-full bg-red-500"
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                />
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`
                    flex-shrink-0 mt-0.5
                    ${alert.type === 'critical' ? 'text-red-600 dark:text-red-400' : ''}
                    ${alert.type === 'warning' ? 'text-orange-600 dark:text-orange-400' : ''}
                    ${alert.type === 'info' ? 'text-blue-600 dark:text-blue-400' : ''}
                  `}>
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <AlertTitle className="flex items-center space-x-2 text-base">
                      <span>{alert.title}</span>
                      <Badge 
                        variant={alert.type === 'critical' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {alert.changePercent.toFixed(1)}% change
                      </Badge>
                    </AlertTitle>
                    
                    <AlertDescription className="mt-2 space-y-2">
                      <p className="text-sm">{alert.message}</p>
                      
                      {/* Alert metadata */}
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimestamp(alert.timestamp)}</span>
                        </div>
                        
                        {alert.aoiName && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{alert.aoiName}</span>
                          </div>
                        )}
                        
                        {alert.threshold && (
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>Threshold: {alert.threshold}%</span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      {alert.actions && alert.actions.length > 0 && (
                        <div className="flex items-center space-x-2 pt-2">
                          {alert.actions.map((action, actionIndex) => (
                            <Button
                              key={actionIndex}
                              size="sm"
                              variant={action.variant || 'outline'}
                              onClick={action.action}
                              className="text-xs h-7"
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </div>

                {/* Dismiss button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(alert.id)}
                  className="h-6 w-6 p-0 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Auto-hide progress bar for critical alerts */}
              {autoHide && alert.type === 'critical' && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-red-500"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: autoHideDelay / 1000, ease: 'linear' }}
                  onAnimationComplete={() => handleDismiss(alert.id)}
                />
              )}
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Show more indicator */}
      {alerts.filter(a => !dismissedAlerts.has(a.id)).length > maxVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-2"
        >
          <Button variant="outline" size="sm" className="text-xs">
            +{alerts.filter(a => !dismissedAlerts.has(a.id)).length - maxVisible} more alerts
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
} 