import {
  realDataApiBoundaryDrafts,
  realDataEntityMappings,
  realDataGuardrails,
  realDataMappingPageData,
  realDataMigrationSteps,
  realDataSurfaceLabels,
  realDataUiBlocks,
} from "@/config/real-data-mapping";
import type {
  MeApiBoundaryDraft,
  MeEntityMapping,
  MeLocalizedText,
  MeRealDataMappingPageData,
  MeUiDataBlock,
  MeUiSurfaceKey,
} from "@/types/real-data-mapping";

export function getRealDataMappingPageData(): MeRealDataMappingPageData {
  return realDataMappingPageData;
}

export function getUiDataBlocks(): MeUiDataBlock[] {
  return realDataUiBlocks;
}

export function getUiDataBlocksBySurface(surface: MeUiSurfaceKey): MeUiDataBlock[] {
  return realDataUiBlocks.filter((block) => block.surface === surface);
}

export function getEntityMappings(): MeEntityMapping[] {
  return realDataEntityMappings;
}

export function getEntityMappingByEntity(entity: string): MeEntityMapping | undefined {
  return realDataEntityMappings.find((item) => item.entity === entity);
}

export function getApiBoundaryDrafts(): MeApiBoundaryDraft[] {
  return realDataApiBoundaryDrafts;
}

export function getApiBoundariesByEntity(entity: string): MeApiBoundaryDraft[] {
  return realDataApiBoundaryDrafts.filter((item) => item.entities.includes(entity));
}

export function getMigrationSteps() {
  return realDataMigrationSteps;
}

export function getRealDataGuardrails() {
  return realDataGuardrails;
}

export function resolveUiBlockLabel(block: MeUiDataBlock, locale: keyof MeLocalizedText = "en"): string {
  return block.label[locale];
}

export function resolveEntityLabel(entity: MeEntityMapping, locale: keyof MeLocalizedText = "en"): string {
  return entity.label[locale];
}

export function resolveSurfaceLabel(surface: MeUiSurfaceKey, locale: keyof MeLocalizedText = "en"): string {
  return realDataSurfaceLabels[surface][locale];
}
