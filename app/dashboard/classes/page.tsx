"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Clock, Users, Loader2, Edit, Trash2 } from "lucide-react";
import { classService, trainerService } from "@/src/services";
import type { GymClass } from "@/src/services/class.service";
import { toast } from "sonner";

export default function ClassesPage() {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<GymClass | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    trainerId: "",
    schedule: "",
    duration: "60",
    capacity: "20",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesRes, trainersRes] = await Promise.all([
        classService.getClasses(),
        trainerService.getTrainers(),
      ]);
      if (classesRes.success) setClasses(classesRes.data);
      if (trainersRes.success)
        setTrainers(trainersRes.data.filter((t: any) => t.status === "active"));
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (gymClass?: GymClass) => {
    if (gymClass) {
      setEditingClass(gymClass);
      setFormData({
        name: gymClass.name,
        description: gymClass.description || "",
        trainerId: gymClass.trainerId || "",
        schedule: gymClass.schedule,
        duration: gymClass.duration.toString(),
        capacity: gymClass.capacity.toString(),
      });
    } else {
      setEditingClass(null);
      setFormData({
        name: "",
        description: "",
        trainerId: "",
        schedule: "",
        duration: "60",
        capacity: "20",
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const classData: any = {
        name: formData.name,
        description: formData.description || undefined,
        trainerId: formData.trainerId || undefined,
        schedule: formData.schedule,
        duration: parseInt(formData.duration),
        capacity: parseInt(formData.capacity),
      };

      if (editingClass) {
        const response = await classService.updateClass(
          editingClass.id,
          classData,
        );
        if (response.success) {
          toast.success("Class updated!");
          setClasses(
            classes.map((c) => (c.id === editingClass.id ? response.data : c)),
          );
        }
      } else {
        const response = await classService.createClass(classData);
        if (response.success) {
          toast.success("Class created!");
          setClasses([...classes, response.data]);
        }
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (classId: string) => {
    if (!confirm("Delete this class?")) return;
    try {
      await classService.deleteClass(classId);
      toast.success("Deleted!");
      setClasses(classes.filter((c) => c.id !== classId));
    } catch (error: any) {
      toast.error("Failed to delete");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Classes</h1>
            <p className="text-muted-foreground">Manage gym classes</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingClass ? "Edit" : "Create"} Class
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Trainer</Label>
                    <Select
                      value={formData.trainerId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, trainerId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select trainer" />
                      </SelectTrigger>
                      <SelectContent>
                        {trainers.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Schedule *</Label>
                    <Input
                      type="datetime-local"
                      value={formData.schedule}
                      onChange={(e) =>
                        setFormData({ ...formData, schedule: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Duration (min)</Label>
                      <Input
                        type="number"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({ ...formData, duration: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Capacity</Label>
                      <Input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) =>
                          setFormData({ ...formData, capacity: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes.map((c) => (
              <Card key={c.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{c.name}</CardTitle>
                    <Badge>{c.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    {c.duration} min
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    {c.currentEnrollment}/{c.capacity}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(c)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(c.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
