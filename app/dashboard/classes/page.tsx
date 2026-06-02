"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Users, Loader2 } from "lucide-react";
import { classService } from "@/src/services";
import type { GymClass } from "@/src/services/class.service";

export default function ClassesPage() {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await classService.getClasses();
        if (response.success) {
          setClasses(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Classes</h1>
            <p className="text-muted-foreground">
              Manage your gym classes and schedules
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Classes ({classes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : classes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No classes yet</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Class
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((gymClass) => (
                  <Card key={gymClass.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">
                          {gymClass.name}
                        </CardTitle>
                        <Badge
                          variant={
                            gymClass.status === "active"
                              ? "default"
                              : gymClass.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {gymClass.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {gymClass.description && (
                        <p className="text-sm text-muted-foreground">
                          {gymClass.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{gymClass.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {gymClass.currentEnrollment}/{gymClass.capacity}{" "}
                          enrolled
                        </span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
