import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";

type ChartDataType = "citations" | "traffic" | "conversions";

interface ChartData {
  month: string;
  citations: number;
  traffic: number;
  conversions: number;
}

const chartData: ChartData[] = [
  { month: "Jan", citations: 1200, traffic: 8500, conversions: 145 },
  { month: "Feb", citations: 1450, traffic: 9200, conversions: 167 },
  { month: "Mar", citations: 1780, traffic: 11200, conversions: 198 },
  { month: "Apr", citations: 2100, traffic: 13800, conversions: 234 },
  { month: "May", citations: 2350, traffic: 15600, conversions: 289 },
  { month: "Jun", citations: 2847, traffic: 18429, conversions: 342 },
];

const toggleOptions = [
  { id: "citations", label: "AI Citations", color: "#6366f1" },
  { id: "traffic", label: "Citation Traffic", color: "#10b981" },
  { id: "conversions", label: "Conversions", color: "#8b5cf6" },
] as const;

export const PerformanceChart = () => {
  const [activeToggles, setActiveToggles] = useState<Set<ChartDataType>>(
    new Set(["citations", "traffic", "conversions"])
  );

  const handleToggle = (toggle: ChartDataType) => {
    const newToggles = new Set(activeToggles);
    if (newToggles.has(toggle)) {
      newToggles.delete(toggle);
    } else {
      newToggles.add(toggle);
    }
    setActiveToggles(newToggles);
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-custom-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground">
            AI Citation Performance Trends
          </CardTitle>
          
          {/* Interactive Toggles */}
          <div className="flex items-center space-x-2">
            {toggleOptions.map((option) => (
              <Button
                key={option.id}
                variant={activeToggles.has(option.id as ChartDataType) ? "default" : "outline"}
                size="sm"
                onClick={() => handleToggle(option.id as ChartDataType)}
                className={cn(
                  "transition-all duration-200 relative",
                  activeToggles.has(option.id as ChartDataType) 
                    ? "bg-primary text-primary-foreground shadow-glow" 
                    : "hover:bg-muted"
                )}
              >
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: option.color }}
                />
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "var(--shadow-md)"
                }}
              />
              <Legend />
              
              {activeToggles.has("citations") && (
                <Line
                  type="monotone"
                  dataKey="citations"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: "#6366f1", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: "#6366f1", strokeWidth: 2 }}
                  name="Citations"
                />
              )}
              
              {activeToggles.has("traffic") && (
                <Line
                  type="monotone"
                  dataKey="traffic"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2 }}
                  name="Traffic"
                />
              )}
              
              {activeToggles.has("conversions") && (
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: "#8b5cf6", strokeWidth: 2 }}
                  name="Conversions"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};