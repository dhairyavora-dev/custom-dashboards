
import React, { useState } from 'react';
import { Laptop } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useDashboard } from '@/contexts/DashboardContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CreateDashboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateDashboardModal: React.FC<CreateDashboardModalProps> = ({ open, onOpenChange }) => {
  const [name, setName] = useState('');
  const { toast } = useToast();
  const { createDashboard } = useDashboard();

  const handleSubmit = () => {
    if (name.trim()) {
      createDashboard(name.trim());
      toast({
        title: "Success",
        description: `Dashboard '${name}' created successfully.`,
      });
      onOpenChange(false);
      setName('');
    }
  };

  const isValidName = name.trim().length > 0 && name.length <= 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Dashboard</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Dashboard Name</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter dashboard name"
                      maxLength={100}
                      pattern="[A-Za-z0-9\s\-_]+"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Name your dashboard so you can find it easily later</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="p-6 bg-netcore-gray rounded-lg">
            <div className="flex justify-center mb-6">
              <Laptop className="w-24 h-24 text-netcore-blue opacity-80" />
            </div>
            <div className="space-y-4 text-center">
              <h3 className="text-lg font-semibold">Dashboards</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dashboard is a collection of charts, which provides an overview of most important reports and metrics.<br />
                Dashboards let you quickly monitor the health of your product and marketing efforts.<br />
                Create a new dashboard and start adding important charts.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleSubmit} disabled={!isValidName}>
                  Create
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to create your new dashboard and start adding charts</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDashboardModal;
