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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Loader2, DollarSign } from "lucide-react";
import { planService } from "@/src/services";
import type { Plan } from "@/src/services/plan.service";
import { toast } from "sonner";

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "1",
    durationType: "months" as "days" | "weeks" | "months" | "years",
    price: "",
    currency: "USD",
    features: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await planService.getPlans();
      if (response.success) {
        setPlans(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        description: plan.description || "",
        duration: plan.duration.toString(),
        durationType: plan.durationType,
        price: plan.price.toString(),
        currency: plan.currency,
        features: plan.features?.join("\n") || "",
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: "",
        description: "",
        duration: "1",
        durationType: "months",
        price: "",
        currency: "USD",
        features: "",
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      toast.error("Name and price are required");
      return;
    }

    try {
      setSubmitting(true);
      const planData = {
        name: formData.name,
        description: formData.description || undefined,
        duration: parseInt(formData.duration),
        durationType: formData.durationType,
        price: parseFloat(formData.price),
        currency: formData.currency,
        features: formData.features
          ? formData.features.split("\n").filter((f) => f.trim())
          : undefined,
      };

      if (editingPlan) {
        const response = await planService.updatePlan(editingPlan.id, planData);
        if (response.success) {
          toast.success("Plan updated successfully!");
          setPlans(
            plans.map((p) => (p.id === editingPlan.id ? response.data : p)),
          );
        }
      } else {
        const response = await planService.createPlan(planData);
        if (response.success) {
          toast.success("Plan created successfully!");
          setPlans([...plans, response.data]);
        }
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save plan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;

    try {
      await planService.deletePlan(planId);
      toast.success("Plan deleted successfully!");
      setPlans(plans.filter((p) => p.id !== planId));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete plan");
    }
  };

  const handleToggleStatus = async (plan: Plan) => {
    try {
      const newStatus = plan.status === "active" ? "inactive" : "active";
      const response = await planService.updatePlan(plan.id, {
        status: newStatus,
      });
      if (response.success) {
        toast.success(
          `Plan ${newStatus === "active" ? "activated" : "deactivated"}`,
        );
        setPlans(plans.map((p) => (p.id === plan.id ? response.data : p)));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update plan status");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Membership Plans</h1>
            <p className="text-muted-foreground">
              Create and manage membership plans for your gym
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingPlan ? "Edit Plan" : "Create New Plan"}
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the details to {editingPlan ? "update" : "create"} a
                    membership plan
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Plan Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Premium Monthly"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="29.99"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of the plan"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration *</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({ ...formData, duration: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="durationType">Duration Type *</Label>
                      <Select
                        value={formData.durationType}
                        onValueChange={(value: any) =>
                          setFormData({ ...formData, durationType: value })
                        }
                      >
                        <SelectTrigger id="durationType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="weeks">Weeks</SelectItem>
                          <SelectItem value="months">Months</SelectItem>
                          <SelectItem value="years">Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="features">Features (one per line)</Label>
                    <textarea
                      id="features"
                      className="w-full min-h-[120px] px-3 py-2 text-sm border rounded-md"
                      placeholder="Access to gym floor&#10;Free group classes&#10;Personal training discount"
                      value={formData.features}
                      onChange={(e) =>
                        setFormData({ ...formData, features: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : editingPlan ? (
                      "Update Plan"
                    ) : (
                      "Create Plan"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No plans yet</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        plan.status === "active" ? "default" : "secondary"
                      }
                    >
                      {plan.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-base font-normal text-muted-foreground">
                      /{plan.duration} {plan.durationType}
                    </span>
                  </div>

                  {plan.features && plan.features.length > 0 && (
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(plan)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(plan)}
                    >
                      {plan.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(plan.id)}
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
