import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { CategoriesContent } from "@/components/categories/categories-content"

export default function CategoriesPage() {
  return (
    <AppShell>
      <Header title="Categories" description="Manage medicine categories" />
      <CategoriesContent />
    </AppShell>
  )
}
