import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: {
    id: string;
    businessName: string;
    category: string;
  };
  selectedPackage?: {
    id: string;
    name: string;
    price: string;
  } | null;
}

export default function InquiryModal({ isOpen, onClose, vendor, selectedPackage }: InquiryModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState(selectedPackage?.price || '');
  const [eventDate, setEventDate] = useState<Date>();

  const sendInquiryMutation = useMutation({
    mutationFn: async (inquiryData: any) => {
      return apiRequest('POST', '/api/inquiries', inquiryData);
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Sent",
        description: "Your inquiry has been sent to the vendor. They will respond soon!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries/sent"] });
      onClose();
      setMessage('');
      setBudget('');
      setEventDate(undefined);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message for the vendor.",
        variant: "destructive",
      });
      return;
    }

    const inquiryData = {
      vendorId: vendor.id,
      message: message.trim(),
      budget: budget ? parseFloat(budget.replace(/[,$]/g, '')) : undefined,
      eventDate: eventDate?.toISOString(),
    };

    sendInquiryMutation.mutate(inquiryData);
  };

  const getDefaultMessage = () => {
    const packageInfo = selectedPackage 
      ? ` I'm interested in your ${selectedPackage.name} package.`
      : '';
    
    return `Hi! I'm planning my wedding and I'm interested in your ${vendor.category.toLowerCase()} services.${packageInfo} Could you please provide more information about your availability and services? Thank you!`;
  };

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-testid="inquiry-modal">
        <DialogHeader>
          <DialogTitle className="text-xl font-playfair">
            Send Inquiry to {vendor.businessName}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vendor Info */}
          <div className="bg-blush/20 rounded-lg p-4" data-testid="vendor-info">
            <h3 className="font-semibold text-charcoal mb-1">{vendor.businessName}</h3>
            <p className="text-sm text-charcoal/70">{vendor.category}</p>
            {selectedPackage && (
              <div className="mt-2 p-2 bg-white/60 rounded">
                <p className="text-sm">
                  <span className="font-medium">Selected Package:</span> {selectedPackage.name}
                </p>
                <p className="text-sm text-sage font-medium">
                  ${parseFloat(selectedPackage.price).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">Budget Range (Optional)</Label>
            <Input
              id="budget"
              type="text"
              placeholder="e.g., 5000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              data-testid="input-budget"
            />
          </div>

          {/* Event Date */}
          <div className="space-y-2">
            <Label>Event Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  data-testid="button-event-date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {eventDate ? format(eventDate, "PPP") : "Select event date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={eventDate}
                  onSelect={setEventDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              placeholder={getDefaultMessage()}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
              data-testid="textarea-message"
            />
            <p className="text-xs text-charcoal/60">
              Tell the vendor about your wedding plans and what you're looking for.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={!message.trim() || sendInquiryMutation.isPending}
              className="flex-1 bg-rose-gold text-white hover:bg-rose-gold/90"
              data-testid="button-send-inquiry"
            >
              {sendInquiryMutation.isPending ? "Sending..." : "Send Inquiry"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
