// src/components/ConnectionTest.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Wifi, WifiOff } from 'lucide-react';
import { useHealthCheck, useConnectionStatus } from '@/hooks/useApi';

export function ConnectionTest() {
  const { data: healthData, isLoading, isError, refetch } = useHealthCheck();
  const { isOnline, apiStatus, isConnected } = useConnectionStatus();

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (isConnected) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-500">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">Disconnected</Badge>;
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          API Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Internet:</span>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">API Status:</span>
          {getStatusBadge(apiStatus)}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Backend URL:</span>
          <span className="text-xs text-muted-foreground">localhost:8000</span>
        </div>

        {healthData && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              ✅ {healthData.service}
            </p>
            <p className="text-xs text-green-600 dark:text-green-300">
              Status: {healthData.status}
            </p>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              ❌ Connection Failed
            </p>
            <p className="text-xs text-red-600 dark:text-red-300">
              Make sure your FastAPI server is running on localhost:8000
            </p>
          </div>
        )}

        <Button 
          onClick={() => refetch()} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Connection'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}