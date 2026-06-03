"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Loader2, Mail, Phone } from "lucide-react";
import { trainerService } from "@/src/services";
import type { Trainer } from "@/src/services/trainer.service";
import { toast } from "sonner";

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    certification: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await trainerService.getTrainers();
      if (response.success) {
        setTrainers(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch trainers");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (trainer?: Trainer) => {
    if (trainer) {
      setEditingTrainer(trainer);
      setFormData({
        name: trainer.name,
        email: trainer.email || "",
        phone: trainer.phone || "",
        specialization: trainer.specialization || "",
        experience: trainer.experience?.toString() || "",
        certification: trainer.certification || "",
      });
    } else {
      setEditingTrainer(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        experience: "",
        certification: "",
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Name is required");
      return;
    }

    try {
      setSubmitting(true);
      const trainerData: any = {
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        specialization: formData.specialization || undefined,
        experience: formData.experience
          ? parseInt(formData.experience)
          : undefined,
        certification: formData.certification || undefined,
      };

      if (editingTrainer) {
        const response = await trainerService.updateTrainer(
          editingTrainer.id,
          trainerData,
        );
        if (response.success) {
          toast.success("Trainer updated successfully!");
          setTrainers(
            trainers.map((t) =>
              t.id === editingTrainer.id ? response.data : t,
            ),
          );
        }
      } else {
        const response = await trainerService.createTrainer(trainerData);
        if (response.success) {
          toast.success("Trainer added successfully!");
          setTrainers([...trainers, response.data]);
        }
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save trainer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (trainerId: string) => {
    if (!confirm("Are you sure you want to delete this trainer?")) return;

    try {
      await trainerService.deleteTrainer(trainerId);
      toast.success("Trainer deleted successfully!");
      setTrainers(trainers.filter((t) => t.id !== trainerId));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete trainer");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Trainers</h1>
            <p className="text-muted-foreground">
              Manage your gym trainers and their specializations
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              render={<Button />}
              onClick={() => handleOpenDialog()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Trainer
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingTrainer ? "Edit Trainer" : "Add New Trainer"}
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the trainer details
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@gym.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="+1234567890"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      placeholder="e.g., Strength Training, Yoga"
                      value={formData.specialization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialization: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience (years)</Label>
                      <Input
                        id="experience"
                        type="number"
                        placeholder="5"
                        value={formData.experience}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certification">Certification</Label>
                      <Input
                        id="certification"
                        placeholder="e.g., ACE, NASM"
                        value={formData.certification}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            certification: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : editingTrainer ? (
                      "Update"
                    ) : (
                      "Add Trainer"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Trainers ({trainers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : trainers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No trainers yet</p>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Trainer
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainers.map((trainer) => (
                    <TableRow key={trainer.id}>
                      <TableCell className="font-medium">
                        {trainer.name}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {trainer.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {trainer.email}
                            </div>
                          )}
                          {trainer.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              {trainer.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{trainer.specialization || "-"}</TableCell>
                      <TableCell>
                        {trainer.experience
                          ? `${trainer.experience} years`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            trainer.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {trainer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(trainer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(trainer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
