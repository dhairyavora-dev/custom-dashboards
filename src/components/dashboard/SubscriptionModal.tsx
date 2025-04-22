
import React, { useState } from 'react';
import { Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboardName: string;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ open, onOpenChange, dashboardName }) => {
  const { toast } = useToast();
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [day, setDay] = useState<string>('');
  const [time, setTime] = useState('');

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  const handleEmailInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ([',', ' ', 'Enter'].includes(e.key) && emailInput.trim()) {
      e.preventDefault();
      if (emails.length >= 50) {
        toast({
          title: "Maximum limit reached",
          description: "You can only add up to 50 email addresses",
          variant: "destructive",
        });
        return;
      }
      const email = emailInput.trim();
      if (!emails.includes(email)) {
        setEmails([...emails, email]);
      }
      setEmailInput('');
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Success",
      description: "Dashboard subscription created successfully.",
    });
    onOpenChange(false);
  };

  const isFormValid = emails.length > 0 && frequency && time && 
    (frequency === 'daily' || (frequency !== 'daily' && day));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Subscribe to Dashboard</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Dashboard</Label>
            <Input value={dashboardName} disabled />
          </div>

          <div className="space-y-2">
            <Label>Email Recipients</Label>
            <Input
              placeholder="You can enter up to 50 email IDs"
              value={emailInput}
              onChange={handleEmailInputChange}
              onKeyDown={handleEmailInputKeyDown}
            />
            <p className="text-xs text-muted-foreground">
              Press Enter, Space or Comma to add text to email list.
            </p>
            {emails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {emails.map((email, index) => (
                  <div key={index} className="bg-muted px-2 py-1 rounded-md text-sm flex items-center">
                    {email}
                    <button
                      onClick={() => setEmails(emails.filter((_, i) => i !== index))}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>Frequency</Label>
            <Select value={frequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setFrequency(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {frequency !== 'daily' && (
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {frequency === 'weekly' ? (
                      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                        <SelectItem key={day} value={day.toLowerCase()}>{day}</SelectItem>
                      ))
                    ) : (
                      Array.from({ length: 31 }, (_, i) => (
                        <SelectItem key={i + 1} value={`${i + 1}`}>{`${i + 1}`}</SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}

            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">(Timezone: Asia/Singapore)</p>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg flex items-start space-x-2">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Netcore system logs in to your dashboard to capture the data for this automated report.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            Subscribe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
