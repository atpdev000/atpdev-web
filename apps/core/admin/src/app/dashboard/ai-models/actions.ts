"use server";

import { revalidatePath } from "next/cache";
import { createAIModel, updateAIModel, deleteAIModel, reorderAIModels, AIModelData } from "@atpdev/database";
import { revalidatePortalCache } from "@/lib/revalidate-portal";

async function revalidateModelsCaches() {
  revalidatePath("/dashboard/ai-models");
  revalidatePath("/[lang]", "layout");
  await revalidatePortalCache();
}

export async function createModelAction(formData: FormData) {
  const model = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    provider: formData.get("provider") as string,
    description: formData.get("description") as string,
    docs: formData.get("docs") as string,
    color: formData.get("color") as any,
    icon_name: formData.get("icon_name") as any,
    capabilities: (formData.get("capabilities") as string).split(',').map(s => s.trim()).filter(Boolean),
    tags: (formData.get("tags") as string).split(',').map(s => s.trim()).filter(Boolean),
    is_visible: true,
  };
  
  await createAIModel(model);
  await revalidateModelsCaches();
}

export async function updateModelAction(id: string, formData: FormData) {
  const model = {
    name: formData.get("name") as string,
    provider: formData.get("provider") as string,
    description: formData.get("description") as string,
    docs: formData.get("docs") as string,
    color: formData.get("color") as any,
    icon_name: formData.get("icon_name") as any,
    capabilities: (formData.get("capabilities") as string).split(',').map(s => s.trim()).filter(Boolean),
    tags: (formData.get("tags") as string).split(',').map(s => s.trim()).filter(Boolean),
  };
  
  await updateAIModel(id, model);
  await revalidateModelsCaches();
}

export async function deleteModelAction(id: string) {
  await deleteAIModel(id);
  await revalidateModelsCaches();
}

export async function toggleVisibilityAction(id: string, is_visible: boolean) {
  await updateAIModel(id, { is_visible });
  await revalidateModelsCaches();
}

export async function reorderAIModelsAction(modelIds: string[]) {
  const success = await reorderAIModels(modelIds);
  if (success) {
    await revalidateModelsCaches();
  }
}
