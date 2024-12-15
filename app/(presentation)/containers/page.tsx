import { postgresContainerUseCases } from "@/app/inyections";
import { ContainersList } from "./components/containers-list";

export const dynamic = "force-dynamic";

export default async function ContainersPage() {
  const containers = await postgresContainerUseCases.listContainers();

  return <ContainersList containers={containers} />;
}
