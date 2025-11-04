import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@radix-ui/themes'
import { PageLayout } from '../components/PageLayout'
import { PageHeader } from '../components/PageHeader'
import { AnalyticsDashboard } from '../components/AnalyticsDashboard'

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
          size="2"
          variant="solid"
          className="text-sm sm:text-base w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
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
