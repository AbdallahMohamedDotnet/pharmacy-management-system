import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { MedicinesContent } from "@/components/medicines/medicines-content"

export default function MedicinesPage() {
  return (
    <AppShell>
      <Header title="Medicines" description="Browse and manage medicine inventory" />
      <MedicinesContent />
    </AppShell>
  )
}
