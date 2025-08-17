import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from "web-vitals";

interface PerformanceMetricDisplay {
  name: string;
  value: number;
  rating?: "good" | "needs-improvement" | "poor";
  unit: string;
}

interface PerformanceMonitorProps {
  pageType: "ISR" | "SSR" | "CSR";
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  pageType,
}) => {
  const router = useRouter();
  const [metrics, setMetrics] = useState<PerformanceMetricDisplay[]>([]);
  const [pageLoadTime, setPageLoadTime] = useState<number | null>(null);
  const [initialLoadTimestamp, setInitialLoadTimestamp] = useState<number>(
    Date.now()
  );

  const updateMetric = (metric: Metric) => {
    setMetrics((prev) => {
      const existingMetricIndex = prev.findIndex((m) => m.name === metric.name);
      const newMetric: PerformanceMetricDisplay = {
        name: metric.name,
        value: metric.value,
        rating: (metric as any).rating,
        unit: metric.name === "CLS" ? "" : "ms",
      };

      if (existingMetricIndex > -1) {
        if (prev[existingMetricIndex].value !== newMetric.value) {
          const updatedMetrics = [...prev];
          updatedMetrics[existingMetricIndex] = newMetric;
          return updatedMetrics;
        }
        return prev;
      }
      return [...prev, newMetric];
    });
    console.log(
      `Performance Metric received: ${metric.name} = ${metric.value.toFixed(
        2
      )}${metric.name === "CLS" ? "" : "ms"}`
    );
  };

  useEffect(() => {
    setMetrics([]);
    setPageLoadTime(null);
    setInitialLoadTimestamp(Date.now());
    console.log(
      `Performance Monitor: Route changed to ${
        router.asPath
      } (${pageType}) - Reset metrics. Started at ${Date.now()}`
    );

    onCLS((metric) => updateMetric(metric), { reportAllChanges: true });
    onINP((metric) => updateMetric(metric), { reportAllChanges: false });
    onFCP((metric) => updateMetric(metric), { reportAllChanges: false });
    onLCP((metric) => updateMetric(metric), { reportAllChanges: false });
    onTTFB((metric) => updateMetric(metric), { reportAllChanges: false });

    const handleLoad = () => {
      const loadTime = Date.now() - initialLoadTimestamp;
      setPageLoadTime(Math.round(loadTime));
      console.log(
        `Performance Monitor: ${pageType} Full Load Time: ${Math.round(
          loadTime
        )}ms`
      );
    };

    if (typeof window !== "undefined") {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("load", handleLoad);
      }

      console.log("Performance Monitor: Cleaned up listeners.");
    };
  }, [router.asPath, pageType, initialLoadTimestamp]);

  const getRatingColor = (rating?: string) => {
    switch (rating) {
      case "good":
        return "text-green-600";
    }
  };

  const getPageTypeColor = (type: string) => {
    switch (type) {
      case "ISR":
        return "bg-blue-500";
      case "SSR":
        return "bg-orange-500";
      case "CSR":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-xs z-50 border">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-3 h-3 rounded-full ${getPageTypeColor(pageType)}`}
        ></div>
        <h3 className="font-bold text-sm">{pageType} Performance</h3>
      </div>

      {pageLoadTime !== null && (
        <div className="mb-2">
          <div className="text-xs text-gray-600">Full Page Load Time</div>
          <div className="font-medium">{pageLoadTime}ms</div>
        </div>
      )}

      <div className="space-y-1">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="flex justify-between items-center text-xs"
          >
            <span>{metric.name}:</span>
            <span className={`font-medium ${getRatingColor(metric.rating)}`}>
              {metric.value.toFixed(metric.name === "CLS" ? 3 : 2)}
              {metric.unit}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2 text-xs text-gray-500">
        <div>Real-time performance metrics (Core Web Vitals)</div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
