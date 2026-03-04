import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '../components/PageLayout'
import { PageHeader } from '../components/PageHeader'
import { VideoTutorials } from '../components/VideoTutorials'

export function VideosPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <PageLayout>
            <PageHeader
                title={t('videoTutorials.title')}
                subtitle={t('videoTutorials.subtitle')}
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
                <VideoTutorials />
            </div>
        </PageLayout>
    )
}
