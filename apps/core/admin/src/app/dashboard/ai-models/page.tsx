import { getProjects, getAIModels } from "@atpdev/database";
import AIModelsClient from "./AIModelsClient";

export const dynamic = 'force-dynamic';

export default async function AIModelsPage() {
  const [projects, aiModels] = await Promise.all([
    getProjects(),
    getAIModels(),
  ]);
  return <AIModelsClient projects={projects} initialAiModels={aiModels} />;
}
