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
import { cn } from '@/lib/utils';
import type { SubmissionExitConfirmDialogProps } from '../types';

/**
 * Confirmation dialog prompting the creator when attempting to cancel or exit
 * the video submission modal with unsaved progress or actions.
 *
 * @param props - Component properties containing open state, confirm/cancel callbacks, and optional className.
 * @returns Rendered alert dialog modal.
 */
export function SubmissionExitConfirmDialog({
  open,
  onConfirm,
  onCancel,
  className,
}: SubmissionExitConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
      <AlertDialogContent
        size="default"
        className={cn('sm:max-w-md z-[70]', className)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Tinggalkan Pengajuan Video?</AlertDialogTitle>
          <AlertDialogDescription>
            Progres pengajuan video kamu belum tersimpan. Jika kamu keluar sekarang, data yang sudah kamu pilih atau isi akan direset.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel onClick={onCancel} className="rounded-xl cursor-pointer">
            Lanjutkan Pengajuan
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            className="rounded-xl cursor-pointer">
            Keluar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
