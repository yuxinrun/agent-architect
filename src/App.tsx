import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/Home/HomePage'
import { SectionPage } from '@/pages/SectionPage'
import { ArticlePage } from '@/pages/ArticlePage'
import { ArchitecturePage } from '@/pages/ArchitecturePage'
import { PatternsPage } from '@/pages/PatternsPage'
import { DecisionGuidePage } from '@/pages/DecisionGuidePage'
import { DiagramsPage } from '@/pages/DiagramsPage'
import { ExplorerPage } from '@/pages/ExplorerPage'
import { KnowledgeGraphPage } from '@/pages/KnowledgeGraphPage'
import { RoadmapPage } from '@/pages/RoadmapPage'
import { AboutPage } from '@/pages/AboutPage'
import { CasesPage, BooksPage, PapersPage, SavedPage } from '@/pages/ReferencePages'
import { TopicCatalogPage, TopicPage } from '@/pages/TopicPages'
import { BlueprintsPage } from '@/pages/BlueprintsPage'
import { OpenSourcePage, ResearchCenterPage } from '@/pages/ResearchPages'

const domainPaths = [
  'engineering', 'multi-agent', 'workflow', 'frameworks', 'protocols',
  'mechanisms', 'memory-context', 'runtime', 'security', 'evaluation', 'production',
  'applications', 'research', 'product', 'future',
]

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/topic-catalog" element={<TopicCatalogPage />} />
          <Route path="/topic/:slug" element={<TopicPage />} />
          <Route path="/blueprints" element={<BlueprintsPage />} />
          <Route path="/open-source" element={<OpenSourcePage />} />
          <Route path="/research-center" element={<ResearchCenterPage />} />
          {domainPaths.map((id) => <Route key={id} path={`/${id}`} element={<SectionPage />} />)}
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/patterns" element={<PatternsPage />} />
          <Route path="/diagrams" element={<DiagramsPage />} />
          <Route path="/explorer" element={<ExplorerPage />} />
          <Route path="/decision-guide" element={<DecisionGuidePage />} />
          <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/papers" element={<PapersPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/:sectionId" element={<SectionPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
