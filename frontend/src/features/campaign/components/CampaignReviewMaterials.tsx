import { ExternalLink, Layers, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MATERIAL_TYPE_LABELS, type MaterialTypeOption } from '../schemas';
import type { CampaignReviewMaterialsProps } from '../types';

/**
 * Section 2 review card: Displays list of promotional materials and asset download links.
 *
 * @param props - Component properties containing material items and edit navigation handler.
 * @returns The rendered materials review card element.
 */
export function CampaignReviewMaterials({ materials, onEdit }: CampaignReviewMaterialsProps) {
  const activeMaterials = materials?.filter((item) => item.status !== 'DELETED') ?? [];
  const materialsCountDescription = `${activeMaterials.length} aset disediakan untuk kreator`;

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-base">2. Materi & Aset Promosi</CardTitle>
            <CardDescription>{materialsCountDescription}</CardDescription>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <Pencil className="h-3.5 w-3.5" />
          Ubah
        </Button>
      </CardHeader>

      <CardContent className="pt-1">
        {activeMaterials.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Belum ada materi atau aset yang diunggah.</p>
        ) : (
          <div className="divide-y divide-border/40 rounded-xl border border-border/60 bg-background/50">
            {activeMaterials.map((material, idx) => {
              const label = MATERIAL_TYPE_LABELS[material.type as MaterialTypeOption] ?? material.type;
              const itemKey = material.id || idx;

              return (
                <div key={itemKey} className="flex items-center justify-between p-3.5 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs font-medium text-foreground">
                      {label}
                    </span>
                    <span className="font-medium text-foreground truncate">{material.name}</span>
                  </div>
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-4 inline-flex items-center gap-1 text-xs text-primary hover:underline shrink-0">
                    Buka Aset <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
