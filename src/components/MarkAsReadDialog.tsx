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
import { Check, SkipForward } from 'lucide-react';

interface MarkAsReadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkAsRead: () => void;
  onSkip: () => void;
  topicTitle: string;
}

export function MarkAsReadDialog({
  open,
  onOpenChange,
  onMarkAsRead,
  onSkip,
  topicTitle,
}: MarkAsReadDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            Marquer comme lu ?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Voulez-vous marquer "<span className="font-medium text-foreground">{topicTitle}</span>" comme lu avant de passer à la fiche suivante ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel
            onClick={onSkip}
            className="gap-2"
          >
            <SkipForward className="h-4 w-4" />
            Passer
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onMarkAsRead}
            className="gap-2 bg-progress-complete hover:bg-progress-complete/90"
          >
            <Check className="h-4 w-4" />
            Marquer et continuer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
