import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, DollarSign, Edit, Trash2 } from "lucide-react";

interface BudgetItem {
  id: string;
  category: string;
  description: string;
  estimatedCost?: string;
  actualCost?: string;
  isPaid: boolean;
  notes?: string;
}

export default function BudgetTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    category: '',
    description: '',
    estimatedCost: '',
    actualCost: '',
    notes: '',
  });

  const { data: budgetItems = [], isLoading } = useQuery({
    queryKey: ["/api/budget"],
    enabled: !!user && user.role === 'couple',
  });

  const addBudgetItemMutation = useMutation({
    mutationFn: async (itemData: any) => {
      return apiRequest('POST', '/api/budget', itemData);
    },
    onSuccess: () => {
      toast({
        title: "Budget Item Added",
        description: "Your budget item has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/budget"] });
      setIsAddModalOpen(false);
      setNewItem({
        category: '',
        description: '',
        estimatedCost: '',
        actualCost: '',
        notes: '',
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add budget item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.category.trim() || !newItem.description.trim()) {
      toast({
        title: "Required Fields",
        description: "Please fill in category and description.",
        variant: "destructive",
      });
      return;
    }

    const itemData = {
      category: newItem.category.trim(),
      description: newItem.description.trim(),
      estimatedCost: newItem.estimatedCost ? parseFloat(newItem.estimatedCost) : undefined,
      actualCost: newItem.actualCost ? parseFloat(newItem.actualCost) : undefined,
      notes: newItem.notes.trim() || undefined,
    };

    addBudgetItemMutation.mutate(itemData);
  };

  // Calculate totals
  const totalBudget = user?.roleData?.budget ? parseFloat(user.roleData.budget) : 25000;
  const totalEstimated = budgetItems.reduce((sum: number, item: BudgetItem) => 
    sum + (item.estimatedCost ? parseFloat(item.estimatedCost) : 0), 0);
  const totalSpent = budgetItems.reduce((sum: number, item: BudgetItem) => 
    sum + (item.actualCost ? parseFloat(item.actualCost) : 0), 0);
  const remaining = totalBudget - totalSpent;
  const progressPercentage = (totalSpent / totalBudget) * 100;

  const budgetCategories = [
    'Venue', 'Catering', 'Photography', 'Videography', 'Music/DJ', 
    'Flowers', 'Cake', 'Transportation', 'Attire', 'Rings', 
    'Decorations', 'Invitations', 'Miscellaneous'
  ];

  if (isLoading) {
    return (
      <Card data-testid="budget-tracker-loading">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="budget-tracker">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-sage" />
            Budget Tracker
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-rose-gold text-white hover:bg-rose-gold/90" data-testid="button-add-budget-item">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="add-budget-item-modal">
              <DialogHeader>
                <DialogTitle>Add Budget Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      data-testid="select-category"
                    >
                      <option value="">Select category</option>
                      {budgetCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedCost">Estimated Cost</Label>
                    <Input
                      id="estimatedCost"
                      type="number"
                      placeholder="0.00"
                      value={newItem.estimatedCost}
                      onChange={(e) => setNewItem({ ...newItem, estimatedCost: e.target.value })}
                      data-testid="input-estimated-cost"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Wedding dress, Reception venue..."
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    data-testid="input-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actualCost">Actual Cost (if paid)</Label>
                  <Input
                    id="actualCost"
                    type="number"
                    placeholder="0.00"
                    value={newItem.actualCost}
                    onChange={(e) => setNewItem({ ...newItem, actualCost: e.target.value })}
                    data-testid="input-actual-cost"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes..."
                    value={newItem.notes}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                    rows={3}
                    data-testid="textarea-notes"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="submit"
                    disabled={addBudgetItemMutation.isPending}
                    className="flex-1 bg-rose-gold text-white hover:bg-rose-gold/90"
                    data-testid="button-save-budget-item"
                  >
                    {addBudgetItemMutation.isPending ? "Adding..." : "Add Item"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1"
                    data-testid="button-cancel-budget-item"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center" data-testid="total-budget">
            <p className="text-sm text-charcoal/60">Total Budget</p>
            <p className="text-2xl font-bold text-charcoal">${totalBudget.toLocaleString()}</p>
          </div>
          <div className="text-center" data-testid="total-estimated">
            <p className="text-sm text-charcoal/60">Estimated</p>
            <p className="text-2xl font-bold text-dusty-blue">${totalEstimated.toLocaleString()}</p>
          </div>
          <div className="text-center" data-testid="total-spent">
            <p className="text-sm text-charcoal/60">Spent</p>
            <p className="text-2xl font-bold text-rose-gold">${totalSpent.toLocaleString()}</p>
          </div>
          <div className="text-center" data-testid="remaining-budget">
            <p className="text-sm text-charcoal/60">Remaining</p>
            <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-sage' : 'text-red-500'}`}>
              ${remaining.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6" data-testid="budget-progress">
          <div className="flex justify-between text-sm mb-2">
            <span>Budget Progress</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress 
            value={Math.min(progressPercentage, 100)} 
            className={`h-3 ${progressPercentage > 100 ? 'bg-red-100' : ''}`}
          />
          {progressPercentage > 100 && (
            <p className="text-sm text-red-500 mt-1">
              Over budget by ${(totalSpent - totalBudget).toLocaleString()}
            </p>
          )}
        </div>

        {/* Budget Items */}
        <div className="space-y-3">
          {budgetItems.length > 0 ? (
            budgetItems.map((item: BudgetItem, index: number) => (
              <div 
                key={item.id}
                className="border border-blush rounded-lg p-4 hover:shadow-sm transition-shadow"
                data-testid={`budget-item-${index}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <Badge variant="secondary" className="mr-2" data-testid={`budget-category-${index}`}>
                        {item.category}
                      </Badge>
                      {item.isPaid && (
                        <Badge variant="default" className="bg-sage text-white">
                          Paid
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium text-charcoal" data-testid={`budget-description-${index}`}>
                      {item.description}
                    </h4>
                    {item.notes && (
                      <p className="text-sm text-charcoal/70 mt-1" data-testid={`budget-notes-${index}`}>
                        {item.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right ml-4">
                    {item.estimatedCost && (
                      <p className="text-sm text-charcoal/60" data-testid={`budget-estimated-${index}`}>
                        Est: ${parseFloat(item.estimatedCost).toLocaleString()}
                      </p>
                    )}
                    {item.actualCost && (
                      <p className="text-lg font-semibold text-charcoal" data-testid={`budget-actual-${index}`}>
                        ${parseFloat(item.actualCost).toLocaleString()}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="ghost" size="sm" data-testid={`button-edit-budget-${index}`}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" data-testid={`button-delete-budget-${index}`}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-charcoal/60" data-testid="no-budget-items">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-charcoal/40" />
              <p>No budget items yet</p>
              <p className="text-sm">Add items to track your wedding expenses</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
