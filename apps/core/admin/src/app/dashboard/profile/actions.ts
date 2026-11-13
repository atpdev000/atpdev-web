"use server";

import { revalidatePath } from "next/cache";
import {
  createExperience, deleteExperience, updateExperience,
  createSkill, deleteSkill, updateSkill,
} from "@atpdev/database";
import { revalidatePortalCache } from "@/lib/revalidate-portal";

async function revalidateProfileCaches() {
  revalidatePath("/dashboard/profile");
  revalidatePath("/", "layout");
  await revalidatePortalCache();
}

// ─── EXPERIENCIAS ────────────────────────────────────────────────────────────

export async function addExperience(formData: FormData) {
  const role        = formData.get("role") as string;
  const company     = formData.get("company") as string;
  const date_range  = formData.get("date_range") as string;
  const description = formData.get("description") as string;
  const icon_key    = (formData.get("icon_key") as string)  || "briefcase";
  const color_key   = (formData.get("color_key") as string) || "blue";
  const sort_order  = parseInt((formData.get("sort_order") as string) || "0");
  await createExperience({ role, company, date_range, description, icon_key, color_key, sort_order, is_active: true });
  await revalidateProfileCaches();
}

export async function editExperience(formData: FormData) {
  const id          = parseInt(formData.get("id") as string);
  const role        = formData.get("role") as string;
  const company     = formData.get("company") as string;
  const date_range  = formData.get("date_range") as string;
  const description = formData.get("description") as string;
  const icon_key    = (formData.get("icon_key") as string)  || "briefcase";
  const color_key   = (formData.get("color_key") as string) || "blue";
  const sort_order  = parseInt((formData.get("sort_order") as string) || "0");
  await updateExperience(id, { role, company, date_range, description, icon_key, color_key, sort_order });
  await revalidateProfileCaches();
}

export async function removeExperience(id: number) {
  await deleteExperience(id);
  await revalidateProfileCaches();
}

export async function toggleExperienceActive(id: number, current: boolean) {
  await updateExperience(id, { is_active: !current });
  await revalidateProfileCaches();
}

// ─── SKILLS ──────────────────────────────────────────────────────────────────

export async function addSkill(formData: FormData) {
  const category   = formData.get("category") as string;
  const icon_key   = (formData.get("icon_key") as string)  || "code2";
  const color_key  = (formData.get("color_key") as string) || "blue";
  const itemsRaw   = (formData.get("items") as string) || "";
  const sort_order = parseInt((formData.get("sort_order") as string) || "0");
  const items      = itemsRaw.split(",").map((s) => s.trim()).filter(Boolean);
  await createSkill({ category, icon_key, color_key, items, sort_order, is_active: true });
  await revalidateProfileCaches();
}

export async function editSkill(formData: FormData) {
  const id         = parseInt(formData.get("id") as string);
  const category   = formData.get("category") as string;
  const icon_key   = (formData.get("icon_key") as string)  || "code2";
  const color_key  = (formData.get("color_key") as string) || "blue";
  const itemsRaw   = (formData.get("items") as string) || "";
  const sort_order = parseInt((formData.get("sort_order") as string) || "0");
  const items      = itemsRaw.split(",").map((s) => s.trim()).filter(Boolean);
  await updateSkill(id, { category, icon_key, color_key, items, sort_order });
  await revalidateProfileCaches();
}

export async function removeSkill(id: number) {
  await deleteSkill(id);
  await revalidateProfileCaches();
}

export async function toggleSkillActive(id: number, current: boolean) {
  await updateSkill(id, { is_active: !current });
  await revalidateProfileCaches();
}
