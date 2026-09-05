import { z } from 'zod';

export const MATERIAL_TYPE_OPTIONS = ['VIDEO', 'IMAGE', 'DOCUMENT', 'LINK'] as const;
export type MaterialTypeOption = (typeof MATERIAL_TYPE_OPTIONS)[number];

export const MATERIAL_TYPE_LABELS: Record<MaterialTypeOption, string> = {
  VIDEO: 'Video (Footage / Referensi)',
  IMAGE: 'Gambar / Foto Produk',
  DOCUMENT: 'Dokumen Panduan',
  LINK: 'Tautan (Link Eksternal)',
};

export const materialItemSchema = z.object({
  name: z.string().trim().min(1, 'Nama materi wajib diisi.').max(100, 'Nama materi maksimal 100 karakter.'),
  type: z.enum(MATERIAL_TYPE_OPTIONS, {
    error: 'Pilih jenis materi yang valid.',
  }),
  url: z.string().trim().min(1, 'URL materi wajib diisi.').url('Format URL materi tidak valid (harus diawali http:// atau https://).'),
});

export const materialsFormSchema = z.object({
  materials: z.array(materialItemSchema).min(1, 'Minimal 1 materi kampanye harus ditambahkan.'),
});

export type MaterialItemFormValues = z.infer<typeof materialItemSchema>;
export type MaterialsFormValues = z.infer<typeof materialsFormSchema>;
