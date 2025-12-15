import { useState } from 'react';
import { Play, Clock, HelpCircle, Folder, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Certification } from '@/data/certificationData';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface ExamConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certification: Certification;
  onStart: (config: ExamConfig) => void;
}

export interface ExamConfig {
  questionsCount: number;
  timeLimit: number;
  categories: string[];
  minQuestionsPerCategory?: {
    enabled: boolean;
    global?: number;
    perCategory?: Record<string, number>;
  };
}

export function ExamConfigDialog({
  open,
  onOpenChange,
  certification,
  onStart,
}: ExamConfigDialogProps) {
  const [questionsCount, setQuestionsCount] = useState(20);
  const [timeLimit, setTimeLimit] = useState(30);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    certification.categories.map((c) => c.id)
  );
  
  // Min questions per category state
  const [minQuestionsEnabled, setMinQuestionsEnabled] = useState(false);
  const [useGlobalMin, setUseGlobalMin] = useState(true);
  const [globalMinQuestions, setGlobalMinQuestions] = useState(1);
  const [perCategoryMin, setPerCategoryMin] = useState<Record<string, number>>({});
  const [minQuestionsOpen, setMinQuestionsOpen] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const selectAllCategories = () => {
    setSelectedCategories(certification.categories.map((c) => c.id));
  };

  const deselectAllCategories = () => {
    setSelectedCategories([]);
  };

  const updatePerCategoryMin = (categoryId: string, value: number) => {
    setPerCategoryMin((prev) => ({
      ...prev,
      [categoryId]: Math.max(0, value),
    }));
  };

  const handleStart = () => {
    if (selectedCategories.length === 0) return;
    onStart({
      questionsCount,
      timeLimit,
      categories: selectedCategories,
      minQuestionsPerCategory: minQuestionsEnabled
        ? {
            enabled: true,
            global: useGlobalMin ? globalMinQuestions : undefined,
            perCategory: !useGlobalMin ? perCategoryMin : undefined,
          }
        : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Configurer l'examen simulé
          </DialogTitle>
          <DialogDescription>
            Personnalisez votre session d'examen pour {certification.name} {certification.version}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Questions count */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                Nombre de questions
              </Label>
              <span className="font-mono text-sm text-foreground">{questionsCount}</span>
            </div>
            <Slider
              value={[questionsCount]}
              onValueChange={([value]) => setQuestionsCount(value)}
              min={10}
              max={75}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10</span>
              <span>Examen réel: 75</span>
            </div>
          </div>

          {/* Time limit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Temps limite
              </Label>
              <span className="font-mono text-sm text-foreground">{timeLimit} min</span>
            </div>
            <Slider
              value={[timeLimit]}
              onValueChange={([value]) => setTimeLimit(value)}
              min={10}
              max={90}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10 min</span>
              <span>Examen réel: 90 min</span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-muted-foreground" />
                Catégories ({selectedCategories.length}/{certification.categories.length})
              </Label>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={selectAllCategories}>
                  Tout
                </Button>
                <Button variant="ghost" size="sm" onClick={deselectAllCategories}>
                  Aucun
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {certification.categories.map((category) => (
                <label
                  key={category.id}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors',
                    selectedCategories.includes(category.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <span className="text-sm truncate">{category.title}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Min questions per category - Optional */}
          <Collapsible open={minQuestionsOpen} onOpenChange={setMinQuestionsOpen}>
            <div className="space-y-3 border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={minQuestionsEnabled}
                    onCheckedChange={setMinQuestionsEnabled}
                    id="min-questions-toggle"
                  />
                  <Label htmlFor="min-questions-toggle" className="flex items-center gap-2 cursor-pointer">
                    <Settings2 className="h-4 w-4 text-muted-foreground" />
                    Minimum par catégorie
                  </Label>
                </div>
                {minQuestionsEnabled && (
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronDown className={cn("h-4 w-4 transition-transform", minQuestionsOpen && "rotate-180")} />
                    </Button>
                  </CollapsibleTrigger>
                )}
              </div>

              {minQuestionsEnabled && (
                <CollapsibleContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Garantir un nombre minimum de questions par catégorie sélectionnée.
                  </p>

                  {/* Global vs Per Category toggle */}
                  <div className="flex items-center gap-4 p-2 bg-muted/50 rounded-md">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="minType"
                        checked={useGlobalMin}
                        onChange={() => setUseGlobalMin(true)}
                        className="accent-primary"
                      />
                      <span className="text-sm">Global</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="minType"
                        checked={!useGlobalMin}
                        onChange={() => setUseGlobalMin(false)}
                        className="accent-primary"
                      />
                      <span className="text-sm">Par catégorie</span>
                    </label>
                  </div>

                  {useGlobalMin ? (
                    <div className="flex items-center gap-3">
                      <Label className="text-sm whitespace-nowrap">Min. global :</Label>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={globalMinQuestions}
                        onChange={(e) => setGlobalMinQuestions(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                        className="w-20"
                      />
                      <span className="text-xs text-muted-foreground">question(s) / catégorie</span>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {certification.categories
                        .filter((c) => selectedCategories.includes(c.id))
                        .map((category) => (
                          <div key={category.id} className="flex items-center gap-2">
                            <span className="text-sm truncate flex-1">{category.title}</span>
                            <Input
                              type="number"
                              min={0}
                              max={10}
                              value={perCategoryMin[category.id] ?? 1}
                              onChange={(e) => updatePerCategoryMin(category.id, parseInt(e.target.value) || 0)}
                              className="w-16"
                            />
                          </div>
                        ))}
                    </div>
                  )}
                </CollapsibleContent>
              )}
            </div>
          </Collapsible>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleStart} disabled={selectedCategories.length === 0}>
            <Play className="h-4 w-4 mr-2" />
            Commencer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
