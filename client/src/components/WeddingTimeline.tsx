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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Calendar as CalendarIcon, Clock, CheckCircle, Circle, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: boolean;
  category?: string;
  priority: 'low' | 'medium' | 'high';
}

export default function WeddingTimeline() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    dueDate: undefined as Date | undefined,
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const { data: timelineItems = [], isLoading } = useQuery({
    queryKey: ["/api/timeline"],
    enabled: !!user && user.role === 'couple',
  });

  const addTimelineItemMutation = useMutation({
    mutationFn: async (itemData: any) => {
      return apiRequest('POST', '/api/timeline', itemData);
    },
    onSuccess: () => {
      toast({
        title: "Timeline Item Added",
        description: "Your timeline item has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/timeline"] });
      setIsAddModalOpen(false);
      setNewItem({
        title: '',
        description: '',
        dueDate: undefined,
        category: '',
        priority: 'medium',
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add timeline item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateTimelineItemMutation = useMutation({
    mutationFn: async ({ itemId, updates }: { itemId: string; updates: any }) => {
      return apiRequest('PUT', `/api/timeline/${itemId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/timeline"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update timeline item.",
        variant: "destructive",
      });
    },
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for the timeline item.",
        variant: "destructive",
      });
      return;
    }

    const itemData = {
      title: newItem.title.trim(),
      description: newItem.description.trim() || undefined,
      dueDate: newItem.dueDate?.toISOString(),
      category: newItem.category.trim() || undefined,
      priority: newItem.priority,
    };

    addTimelineItemMutation.mutate(itemData);
  };

  const handleToggleComplete = (item: TimelineItem) => {
    updateTimelineItemMutation.mutate({
      itemId: item.id,
      updates: { isCompleted: !item.isCompleted }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const timelineCategories = [
    'Venue', 'Catering', 'Photography', 'Videography', 'Music/DJ', 
    'Flowers', 'Cake', 'Transportation', 'Attire', 'Rings', 
    'Decorations', 'Invitations', 'Legal', 'Miscellaneous'
  ];

  // Sort items by due date and completion status
  const sortedItems = [...timelineItems].sort((a: TimelineItem, b: TimelineItem) => {
    // Completed items go to bottom
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    
    // Sort by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    return 0;
  });

  // Get upcoming items (not completed, due within next 30 days)
  const upcomingItems = sortedItems.filter((item: TimelineItem) => {
    if (item.isCompleted || !item.dueDate) return false;
    const dueDate = new Date(item.dueDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return dueDate <= thirtyDaysFromNow;
  });

  if (isLoading) {
    return (
      <Card data-testid="timeline-loading">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="wedding-timeline">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-dusty-blue" />
            Wedding Timeline
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-rose-gold text-white hover:bg-rose-gold/90" data-testid="button-add-timeline-item">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="add-timeline-item-modal">
              <DialogHeader>
                <DialogTitle>Add Timeline Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Book wedding venue"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    data-testid="input-title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      data-testid="select-category"
                    >
                      <option value="">Select category</option>
                      {timelineCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      value={newItem.priority}
                      onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as 'low' | 'medium' | 'high' })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      data-testid="select-priority"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        data-testid="button-due-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newItem.dueDate ? format(newItem.dueDate, "PPP") : "Select due date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newItem.dueDate}
                        onSelect={(date) => setNewItem({ ...newItem, dueDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Additional details about this task..."
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    rows={3}
                    data-testid="textarea-description"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="submit"
                    disabled={addTimelineItemMutation.isPending}
                    className="flex-1 bg-rose-gold text-white hover:bg-rose-gold/90"
                    data-testid="button-save-timeline-item"
                  >
                    {addTimelineItemMutation.isPending ? "Adding..." : "Add Task"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1"
                    data-testid="button-cancel-timeline-item"
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
        {/* Upcoming Tasks Summary */}
        {upcomingItems.length > 0 && (
          <div className="bg-champagne/20 rounded-lg p-4 mb-6" data-testid="upcoming-tasks">
            <h3 className="font-semibold text-charcoal mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-dusty-blue" />
              Upcoming Tasks ({upcomingItems.length})
            </h3>
            <div className="space-y-2">
              {upcomingItems.slice(0, 3).map((item: TimelineItem, index: number) => (
                <div key={item.id} className="flex items-center justify-between text-sm" data-testid={`upcoming-task-${index}`}>
                  <span className="text-charcoal">{item.title}</span>
                  <span className="text-charcoal/60">
                    {item.dueDate ? format(new Date(item.dueDate), "MMM d") : 'No date'}
                  </span>
                </div>
              ))}
              {upcomingItems.length > 3 && (
                <p className="text-xs text-charcoal/60">
                  +{upcomingItems.length - 3} more upcoming tasks
                </p>
              )}
            </div>
          </div>
        )}

        {/* Timeline Items */}
        <div className="space-y-3">
          {sortedItems.length > 0 ? (
            sortedItems.map((item: TimelineItem, index: number) => (
              <div 
                key={item.id}
                className={`border rounded-lg p-4 transition-all ${
                  item.isCompleted 
                    ? 'border-sage/30 bg-sage/5' 
                    : 'border-blush hover:shadow-sm'
                }`}
                data-testid={`timeline-item-${index}`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => handleToggleComplete(item)}
                    className="mt-1 text-sage hover:text-sage/80 transition-colors"
                    data-testid={`checkbox-complete-${index}`}
                  >
                    {item.isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className={`font-medium ${item.isCompleted ? 'text-charcoal/60 line-through' : 'text-charcoal'}`} data-testid={`timeline-title-${index}`}>
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className={`text-sm mt-1 ${item.isCompleted ? 'text-charcoal/50' : 'text-charcoal/70'}`} data-testid={`timeline-description-${index}`}>
                            {item.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="ghost" size="sm" data-testid={`button-edit-timeline-${index}`}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" data-testid={`button-delete-timeline-${index}`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-wrap">
                      {item.category && (
                        <Badge variant="secondary" className="text-xs" data-testid={`timeline-category-${index}`}>
                          {item.category}
                        </Badge>
                      )}
                      <Badge className={`text-xs ${getPriorityColor(item.priority)}`} data-testid={`timeline-priority-${index}`}>
                        {item.priority}
                      </Badge>
                      {item.dueDate && (
                        <div className="flex items-center text-xs text-charcoal/60" data-testid={`timeline-due-date-${index}`}>
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {format(new Date(item.dueDate), "MMM d, yyyy")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-charcoal/60" data-testid="no-timeline-items">
              <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-charcoal/40" />
              <p>No timeline tasks yet</p>
              <p className="text-sm">Add tasks to keep your wedding planning on track</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
