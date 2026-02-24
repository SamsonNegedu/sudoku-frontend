import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon, PlayIcon } from '@radix-ui/react-icons';
import { TechniqueVideo } from './learning/TechniqueVideo';
import { videoTutorials, type VideoTutorial } from '../data/videoTutorials';

const VideoDetail: React.FC<{ video: VideoTutorial; onBack: () => void }> = ({ video, onBack }) => {
    const { t } = useTranslation();
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
                onClick={onBack}
                className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
                ← {t('videoTutorials.backToVideos')}
            </button>

            <TechniqueVideo
                youtubeId={video.youtubeId}
                title={video.title}
                creator={video.creator}
                creatorChannel={video.creatorChannel}
                description={video.description}
                duration={video.duration}
                licenseType={video.licenseType}
            />
        </div>
    );
};

const VideoGrid: React.FC<{
    filteredVideos: VideoTutorial[];
    onSelectVideo: (video: VideoTutorial) => void;
}> = ({ filteredVideos, onSelectVideo }) => {
    const { t } = useTranslation();
    
    const getLevelTranslation = (level: string) => {
        const levelMap: Record<string, string> = {
            'basic': 'beginner',
            'intermediate': 'intermediate',
            'advanced': 'advanced',
            'expert': 'expert'
        };
        return t(`videoTutorials.levels.${levelMap[level] || level}`);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map(video => (
                <button
                    key={video.id}
                    onClick={() => onSelectVideo(video)}
                    className="group text-left bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400"
                >
                    <div className="relative bg-neutral-100 dark:bg-gray-700 h-32 flex items-center justify-center group-hover:bg-neutral-200 dark:group-hover:bg-gray-600 transition-colors">
                        <PlayIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                        <div className="absolute top-2 right-2 bg-neutral-800 dark:bg-gray-900 px-2 py-1 rounded text-white text-xs font-semibold">
                            {video.duration} {t('videoTutorials.min')}
                        </div>
                        <div className="absolute bottom-2 left-2 bg-neutral-700 dark:bg-gray-800 px-2 py-1 rounded text-white text-xs font-medium">
                            {getLevelTranslation(video.level)}
                        </div>
                    </div>

                <div className="p-4 space-y-3">
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {video.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">
                            {video.techniqueName}
                        </p>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {video.description}
                    </p>

                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t('videoTutorials.videoBy')} <span className="font-semibold text-gray-700 dark:text-gray-300">{video.creator}</span>
                        </p>
                    </div>
                    </div>
                </button>
            ))}
        </div>
    );
};

export const VideoTutorials: React.FC = () => {
    const { t } = useTranslation();
    const [selectedLevel, setSelectedLevel] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);

    const levels = [
        { id: 'all', name: t('videoTutorials.allLevels') },
        { id: 'basic', name: t('videoTutorials.levels.beginner') },
        { id: 'intermediate', name: t('videoTutorials.levels.intermediate') },
        { id: 'advanced', name: t('videoTutorials.levels.advanced') },
        { id: 'expert', name: t('videoTutorials.levels.expert') },
    ] as const;

    const filteredVideos = useMemo(() => {
        return videoTutorials.filter(video => {
            const matchesLevel = selectedLevel === 'all' || video.level === selectedLevel;
            const matchesSearch =
                searchQuery === '' ||
                video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                video.techniqueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                video.creator.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesLevel && matchesSearch;
        });
    }, [selectedLevel, searchQuery]);

    if (selectedVideo) {
        return <VideoDetail video={selectedVideo} onBack={() => setSelectedVideo(null)} />;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <TextField.Root
                    placeholder={t('videoTutorials.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                />
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    {t('videoTutorials.filterByLevel')}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {levels.map(level => (
                        <button
                            key={level.id}
                            onClick={() => setSelectedLevel(level.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all border ${selectedLevel === level.id
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                    : 'bg-neutral-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-neutral-200 dark:border-gray-600 hover:bg-neutral-100 dark:hover:bg-gray-700 hover:border-neutral-300 dark:hover:border-gray-500'
                                }`}
                        >
                            {level.name}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        {filteredVideos.length} {filteredVideos.length === 1 ? t('videoTutorials.tutorial') : t('videoTutorials.tutorials')}
                    </h3>
                </div>

                {filteredVideos.length === 0 ? (
                    <div className="text-center py-12 bg-neutral-50 dark:bg-gray-700/50 rounded-lg border border-neutral-200 dark:border-gray-600">
                        <PlayIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                            {searchQuery ? t('videoTutorials.noResults') : t('videoTutorials.noTutorialsForLevel')}
                        </p>
                    </div>
                ) : (
                    <VideoGrid
                        filteredVideos={filteredVideos}
                        onSelectVideo={setSelectedVideo}
                    />
                )}
            </div>

            <div className="bg-neutral-50 dark:bg-gray-700/50 border border-neutral-200 dark:border-gray-600 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">{t('videoTutorials.legalNoticeTitle')}</span> {t('videoTutorials.legalNotice')}
                </p>
            </div>
        </div>
    );
};
