
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';

const RealTimeIndicator = () => {
  const { lastUpdate } = useRealTimeUpdates();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Simple connection check - if we haven't received updates for a while, assume disconnected
    const checkConnection = () => {
      const now = new Date();
      if (lastUpdate && (now.getTime() - lastUpdate.getTime()) > 60000) {
        setIsConnected(false);
      } else {
        setIsConnected(true);
      }
    };

    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1">
        {isConnected ? (
          <>
            <Wifi className="w-3 h-3" />
            Live Updates
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            Offline
          </>
        )}
      </Badge>
      {lastUpdate && (
        <span className="text-xs text-muted-foreground">
          Last update: {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default RealTimeIndicator;
