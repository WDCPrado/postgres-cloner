import { postgresContainerUseCases } from "@/app/inyections";
import { ContainersList } from "./components/containers-list";

export default async function ContainersPage() {
  const containers = await postgresContainerUseCases.listContainers();

  return <ContainersList containers={containers} />;
}
