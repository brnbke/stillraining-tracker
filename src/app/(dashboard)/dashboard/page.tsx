"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DataEntry {
  id: string;
  value1: number;
  value2: number;
  value3: number;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalEntries: number;
  avgValue1: number;
  avgValue2: number;
  avgValue3: number;
  recentEntries: DataEntry[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEntries: 0,
    avgValue1: 0,
    avgValue2: 0,
    avgValue3: 0,
    recentEntries: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/data-entries");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch dashboard data");
        }

        const entries: DataEntry[] = result.dataEntries || [];

        // Calculate statistics
        const totalEntries = entries.length;
        let avgValue1 = 0;
        let avgValue2 = 0;
        let avgValue3 = 0;

        if (totalEntries > 0) {
          const sum1 = entries.reduce((sum, entry) => sum + entry.value1, 0);
          const sum2 = entries.reduce((sum, entry) => sum + entry.value2, 0);
          const sum3 = entries.reduce((sum, entry) => sum + entry.value3, 0);

          avgValue1 = sum1 / totalEntries;
          avgValue2 = sum2 / totalEntries;
          avgValue3 = sum3 / totalEntries;
        }

        // Get recent entries (first 5)
        const recentEntries = entries.slice(0, 5);

        setStats({
          totalEntries,
          avgValue1,
          avgValue2,
          avgValue3,
          recentEntries,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatValue = (value: number) => {
    return value.toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your data tracking dashboard
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            {stats.totalEntries > 0 && (
              <Badge variant="secondary">Active</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEntries}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalEntries === 0
                ? "No data entries yet"
                : `${stats.totalEntries} entries recorded`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Value 1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalEntries > 0 ? formatValue(stats.avgValue1) : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalEntries > 0
                ? "Across all entries"
                : "No data available"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Value 2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalEntries > 0 ? formatValue(stats.avgValue2) : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalEntries > 0
                ? "Across all entries"
                : "No data available"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Value 3
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalEntries > 0 ? formatValue(stats.avgValue3) : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalEntries > 0
                ? "Across all entries"
                : "No data available"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest data entries</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentEntries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No recent activity. Start by adding some data entries.
            </p>
          ) : (
            <div className="space-y-4">
              {stats.recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex space-x-4 text-sm font-medium">
                      <span>Value 1: {formatValue(entry.value1)}</span>
                      <span>Value 2: {formatValue(entry.value2)}</span>
                      <span>Value 3: {formatValue(entry.value3)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(entry.createdAt)}
                    </p>
                  </div>
                  <Badge variant="outline">Recorded</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
