import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon, PlayIcon } from '@radix-ui/react-icons';
import { TechniqueVideo } from './learning/TechniqueVideo';
import { videoTutorials, type VideoTutorial } from '../data/videoTutorials';
import { Button } from '@/components/ui/button';

const VideoDetail: React.FC<{ video: VideoTutorial; onBack: () => void }> = ({ video, onBack }) => {
    const { t } = useTranslation();
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Button
                onClick={onBack}
                variant="ghost"
                className="mb-6 gap-2"
            >
                ← {t('videoTutorials.backToVideos')}
            </Button>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map(video => (
                <button
                    key={video.id}
                    onClick={() => onSelectVideo(video)}
                    className="group text-left bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 hover:-translate-y-1 flex flex-col h-full"
                >
                    {/* Thumbnail with gradient overlay */}
                    <div className="relative bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-600 aspect-video w-full flex items-center justify-center overflow-hidden">
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 opacity-10 dark:opacity-5">
                            <div className="absolute inset-0 bg-primary-500/10" style={{
                                backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}></div>
                        </div>

                        {/* Play button with animation */}
                        <div className="relative z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 group-hover:bg-primary-600 dark:group-hover:bg-primary-500 transition-all duration-300 shadow-lg">
                            <PlayIcon className="w-8 h-8 text-primary-600 dark:text-primary-500 group-hover:text-white transition-colors" />
                        </div>

                        {/* Duration badge */}
                        <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded-md text-white text-xs font-semibold">
                            {video.duration} min
                        </div>

                        {/* Level badge */}
                        <div className="absolute bottom-3 left-3 bg-primary-600 dark:bg-primary-500 px-2.5 py-1 rounded-md text-white text-xs font-semibold uppercase tracking-wide">
                            {getLevelTranslation(video.level)}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3 flex flex-col flex-1">
                        <div>
                            <h4 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors line-clamp-2 leading-snug">
                                {video.title}
                            </h4>
                            <p className="text-xs text-primary-600 dark:text-primary-500 font-semibold mt-1.5 uppercase tracking-wide">
                                {video.techniqueName}
                            </p>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
                            {video.description}
                        </p>

                        {/* Creator info */}
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                                {video.creator.charAt(0)}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{video.creator}</span>
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
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
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
                        <Button
                            key={level.id}
                            onClick={() => setSelectedLevel(level.id)}
                            variant={selectedLevel === level.id ? "default" : "outline"}
                            className={selectedLevel === level.id
                                ? 'bg-primary-600 hover:bg-primary-700 text-white border-primary-600 shadow-md'
                                : 'bg-neutral-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-neutral-200 dark:border-gray-600 hover:bg-neutral-100 dark:hover:bg-gray-700 hover:border-neutral-300 dark:hover:border-gray-500'
                            }
                        >
                            {level.name}
                        </Button>
                    ))}
                </div>
            </div>

            <div>
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
