import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { PageLayout, PageHeader } from '../components/layout'
import { AnalyticsDashboard } from '../components/features/analytics'

export function AnalyticsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <PageLayout className="bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title={t('analytics.dashboardTitle')}
        subtitle={t('analytics.trackProgress')}
      >
        <Button
          onClick={() => navigate({ to: '/game' })}
          variant="default"
          className="text-sm sm:text-base w-full sm:w-auto font-semibold shadow-md"
        >
          ← {t('navigation.backToGame')}
        </Button>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnalyticsDashboard />
      </div>
    </PageLayout>
  )
}
