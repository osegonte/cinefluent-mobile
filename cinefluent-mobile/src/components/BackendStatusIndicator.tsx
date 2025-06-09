// Add these components to your frontend for better user feedback
// src/components/BackendStatusIndicator.tsx

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Clock, ExternalLink, RefreshCw } from 'lucide-react';

interface BackendStatusProps {
  apiUrl?: string;
  onStatusChange?: (status: 'connected' | 'deployment_issue' | 'checking') => void;
}

export const BackendStatusIndicator: React.FC<BackendStatusProps> = ({ 
  apiUrl = import.meta.env.VITE_API_BASE_URL,
  onStatusChange 
}) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'deployment_issue'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const checkBackendStatus = async () => {
    setStatus('checking');
    try {
      const response = await fetch(`${apiUrl}/api/v1/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (response.ok) {
        setStatus('connected');
      } else {
        setStatus('deployment_issue');
      }
    } catch (error) {
      setStatus('deployment_issue');
    }
    
    setLastChecked(new Date());
    onStatusChange?.(status);
  };

  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [apiUrl]);

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          color: 'bg-green-500',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: CheckCircle,
          title: 'Backend Connected',
          message: 'Your CineFluent API is running perfectly!',
          progress: 100
        };
      case 'deployment_issue':
        return {
          color: 'bg-yellow-500',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: AlertTriangle,
          title: 'URL Configuration Needed',
          message: 'Backend deployed successfully, but Railway domain needs fixing.',
          progress: 85
        };
      case 'checking':
      default:
        return {
          color: 'bg-blue-500',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          icon: Clock,
          title: 'Checking Connection',
          message: 'Testing backend connectivity...',
          progress: 50
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2 mb-6`}>
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-3 h-3 ${config.color} rounded-full ${status === 'checking' ? 'animate-pulse' : ''}`}></div>
          <Icon className={`w-5 h-5 ${config.textColor}`} />
          <div className="flex-1">
            <h4 className={`font-semibold ${config.textColor}`}>{config.title}</h4>
            <p className={`text-sm ${config.textColor} opacity-80`}>{config.message}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={checkBackendStatus}
            disabled={status === 'checking'}
          >
            <RefreshCw className={`w-4 h-4 ${status === 'checking' ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="bg-white/50 rounded-full h-2">
            <div 
              className={`${config.color} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${config.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1 opacity-75">
            <span>{config.progress}% Complete</span>
            {lastChecked && (
              <span>Last checked: {lastChecked.toLocaleTimeString()}</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          {status === 'deployment_issue' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://railway.app/dashboard', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Railway Dashboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide' : 'Show'} Fix Steps
              </Button>
            </>
          )}
          
          {status === 'connected' && (
            <Badge variant="default" className="bg-green-500">
              ✅ Ready to use!
            </Badge>
          )}
        </div>

        {/* Detailed fix instructions */}
        {showDetails && status === 'deployment_issue' && (
          <Alert className="mt-4">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Quick Fix Steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Go to Railway Dashboard → Find your cinefluent-api project</li>
                  <li>Go to Settings → Networking → Generate Domain (point to port 8000)</li>
                  <li>Copy the new URL and update your .env file</li>
                  <li>Restart your frontend server</li>
                </ol>
                <p className="text-xs text-muted-foreground mt-2">
                  Current URL: {apiUrl}
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
};

// Progress Resolution Helper Component
export const ResolutionHelper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 1,
      title: "Check Railway Dashboard",
      description: "Go to railway.app/dashboard and find your cinefluent-api project",
      action: "Visit Dashboard",
      url: "https://railway.app/dashboard"
    },
    {
      id: 2,
      title: "Generate Domain",
      description: "In Settings → Networking, click 'Generate Domain' and select port 8000",
      action: "Generate Domain",
      instruction: "Look for the 'Domains' section and click 'Generate Domain'"
    },
    {
      id: 3,
      title: "Update Frontend Config",
      description: "Copy the new URL to your .env file and src/lib/api.ts",
      action: "Update Files",
      instruction: "Replace VITE_API_BASE_URL and API_BASE with your new Railway URL"
    },
    {
      id: 4,
      title: "Test Connection",
      description: "Restart your frontend and test the API connection",
      action: "Test & Verify",
      instruction: "Run npm run dev and try logging in"
    }
  ];

  const handleStepComplete = (stepId: number) => {
    setCompletedSteps(prev => [...prev, stepId]);
    if (stepId < steps.length) {
      setCurrentStep(stepId + 1);
    }
  };

  const isStepCompleted = (stepId: number) => completedSteps.includes(stepId);
  const isStepCurrent = (stepId: number) => currentStep === stepId;

  return (
    <Card className="bg-white border border-gray-200">
      <div className="p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
          Railway URL Fix Guide
        </h3>
        
        <div className="space-y-3">
          {steps.map((step) => (
            <div 
              key={step.id}
              className={`flex items-start space-x-3 p-4 rounded-lg border transition-all ${
                isStepCurrent(step.id) ? 'bg-blue-50 border-blue-200' : 
                isStepCompleted(step.id) ? 'bg-green-50 border-green-200' : 
                'bg-gray-50 border-gray-200'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                isStepCompleted(step.id) ? 'bg-green-500 text-white' :
                isStepCurrent(step.id) ? 'bg-blue-500 text-white' : 
                'bg-gray-300 text-gray-600'
              }`}>
                {isStepCompleted(step.id) ? '✓' : step.id}
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{step.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                
                {step.instruction && (isStepCurrent(step.id) || isStepCompleted(step.id)) && (
                  <p className="text-xs text-blue-600 bg-blue-100 p-2 rounded mb-2">
                    💡 {step.instruction}
                  </p>
                )}
                
                {isStepCurrent(step.id) && (
                  <div className="flex space-x-2 mt-2">
                    {step.url ? (
                      <Button 
                        size="sm"
                        onClick={() => window.open(step.url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {step.action}
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleStepComplete(step.id)}
                      >
                        {step.action}
                      </Button>
                    )}
                    
                    <Button 
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStepComplete(step.id)}
                    >
                      Mark Complete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {completedSteps.length === steps.length && (
          <Alert className="mt-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              🎉 Great! All steps completed. Your frontend should now connect to the backend successfully.
              Try refreshing the page and logging in with your test credentials.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
};

// Usage in your main component:
/*
import { BackendStatusIndicator, ResolutionHelper } from '@/components/BackendStatusIndicator';

// In your Learn.tsx or main page:
<BackendStatusIndicator onStatusChange={(status) => console.log('Backend status:', status)} />

// Show resolution helper when needed:
{backendStatus === 'deployment_issue' && <ResolutionHelper />}
*/