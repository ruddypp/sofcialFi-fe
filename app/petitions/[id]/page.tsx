import { DashboardLayout } from "@/components/dashboard-layout"
import { PetitionDetail } from "@/components/petition-detail"

export default async function PetitionPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolvedParams = await params; // unwrap Promise jika diperlukan
  const petitionId = Number.parseInt(resolvedParams.id);

  return (
    <DashboardLayout>
      <PetitionDetail petitionId={petitionId} />
    </DashboardLayout>
  )
}
