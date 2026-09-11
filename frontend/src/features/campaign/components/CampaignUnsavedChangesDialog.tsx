import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { CampaignUnsavedChangesDialogProps } from '../types';

/**
 * Confirmation dialog prompting user when attempting to navigate away
 * with unsaved campaign form changes.
 *
 * @param props - Dialog open state and confirm/cancel action callbacks.
 * @returns The rendered alert dialog modal.
 */
export function CampaignUnsavedChangesDialog({
  isOpen,
  onConfirm,
  onCancel,
}: CampaignUnsavedChangesDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Perubahan Belum Disimpan</AlertDialogTitle>
          <AlertDialogDescription>
            Anda memiliki perubahan data yang belum disimpan di langkah ini. Jika Anda meninggalkan halaman ini, perubahan yang Anda buat akan hilang.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Tetap di Sini</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Tinggalkan Halaman
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
