import { useState, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { UseInitializeCampaignMutation } from '../hooks';

interface CreateCampaignDialogProps {
  /** Trigger element to open the confirmation modal */
  children: ReactNode;
}

/**
 * Confirmation dialog modal for creating a new campaign.
 * Confirms user intention, invokes the campaign initialize endpoint,
 * and navigates to Step 1 upon successful creation.
 *
 * @param props - Component properties containing the trigger children.
 * @returns The confirmation dialog element.
 */
export function CreateCampaignDialog({ children }: CreateCampaignDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const initializeMutation = UseInitializeCampaignMutation({
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const handleConfirm = () => {
    initializeMutation.mutate();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Buat Kampanye Baru?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan membuat draf kampanye baru dan memulai langkah pengaturan kampanye Anda.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={initializeMutation.isPending}>Batal</AlertDialogCancel>
          <Button onClick={handleConfirm} disabled={initializeMutation.isPending} className="flex items-center gap-2">
            {initializeMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Ya, Buat Kampanye</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
