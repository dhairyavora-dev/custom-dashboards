
import React from 'react';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface DeleteDashboardModalProps {
  dashboardName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteDashboardModal: React.FC<DeleteDashboardModalProps> = ({
  dashboardName,
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader className="bg-[#FDECEA] rounded-t-lg p-4">
          <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Delete Custom Dashboard
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="p-6">
          <AlertDialogDescription className="text-base text-foreground">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-medium">{dashboardName}</span>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </div>
            Are you sure you want to delete this dashboard?
          </AlertDialogDescription>
        </div>

        <AlertDialogFooter className="px-6 pb-6">
          <AlertDialogCancel asChild>
            <Button variant="outline" className="text-muted-foreground">
              Cancel
            </Button>
          </AlertDialogCancel>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onConfirm} variant="default" className="bg-netcore-blue hover:bg-netcore-dark-blue">
                  Delete
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This action cannot be undone.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDashboardModal;
