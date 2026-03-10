import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon, PlayIcon } from '@radix-ui/react-icons';
import { TechniqueVideo } from '../../learning/TechniqueDetail';
import { videoTutorials, type VideoTutorial } from '../../../../data/videoTutorials';
import { Button } from '@/components/ui/button';

const useTranslatedVideo = (video: VideoTutorial) => {
    const { t } = useTranslation();
    return {
        ...video,
        title: t(`videoTutorials.videos.${video.id}.title`, { defaultValue: video.title }),
        description: t(`videoTutorials.videos.${video.id}.description`, { defaultValue: video.description }),
    };
};

const VideoDetail: React.FC<{ video: VideoTutorial }> = ({ video }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const translatedVideo = useTranslatedVideo(video);

    const handleBack = () => {
        navigate({ to: '/videos' });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Button
                onClick={handleBack}
                variant="ghost"
                className="mb-6 gap-2"
            >
                ← {t('videoTutorials.backToVideos')}
            </Button>

            <TechniqueVideo
                youtubeId={translatedVideo.youtubeId}
                title={translatedVideo.title}
                creator={translatedVideo.creator}
                creatorChannel={translatedVideo.creatorChannel}
                description={translatedVideo.description}
                duration={translatedVideo.duration}
                licenseType={translatedVideo.licenseType}
                techniqueId={translatedVideo.techniqueId}
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
            {filteredVideos.map(video => {
                const translatedTitle = t(`videoTutorials.videos.${video.id}.title`, { defaultValue: video.title });
                const translatedDescription = t(`videoTutorials.videos.${video.id}.description`, { defaultValue: video.description });

                return (
                    <button
                        key={video.id}
                        onClick={() => onSelectVideo(video)}
                        className="group text-left bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden dark:border-gray-700 flex flex-col h-full"
                    >
                        {/* Thumbnail */}
                        <div className="relative bg-neutral-100 dark:bg-gray-700 aspect-video w-full flex items-center justify-center overflow-hidden">
                            {/* Play button */}
                            <div className="relative z-10 bg-white dark:bg-gray-800 rounded-full p-4 group-hover:scale-110 transition-all duration-200 shadow-md">
                                <PlayIcon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                            </div>

                            {/* Duration badge */}
                            <div className="absolute top-3 right-3 bg-black/75 px-2.5 py-1 rounded text-white text-xs font-medium">
                                {video.duration} min
                            </div>

                            {/* Level badge */}
                            <div className="absolute bottom-3 left-3 bg-gray-800 dark:bg-gray-600 px-2.5 py-1 rounded text-white text-xs font-medium">
                                {getLevelTranslation(video.level)}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-3 flex flex-col flex-1">
                            <div>
                                <h4 className="font-bold text-base text-gray-900 dark:text-white line-clamp-2 leading-snug">
                                    {translatedTitle}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1.5">
                                    {video.techniqueName}
                                </p>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
                                {translatedDescription}
                            </p>

                            {/* Creator info */}
                            <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs font-bold">
                                    {video.creator.charAt(0)}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{video.creator}</span>
                                </p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

interface VideoTutorialsProps {
    initialVideoId?: string;
}

export const VideoTutorials: React.FC<VideoTutorialsProps> = ({ initialVideoId }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedLevel, setSelectedLevel] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);

    // Handle initial video ID from URL
    useEffect(() => {
        if (initialVideoId) {
            const video = videoTutorials.find(v => v.id === initialVideoId);
            if (video) {
                setSelectedVideo(video);
            } else {
                // Video not found, redirect to videos list
                setSelectedVideo(null);
            }
        } else {
            // No video ID in URL, show the list
            setSelectedVideo(null);
        }
    }, [initialVideoId]);

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

            if (searchQuery === '') return matchesLevel;

            const translatedTitle = t(`videoTutorials.videos.${video.id}.title`, { defaultValue: video.title });
            const translatedDescription = t(`videoTutorials.videos.${video.id}.description`, { defaultValue: video.description });

            const matchesSearch =
                translatedTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                video.techniqueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                translatedDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                video.creator.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesLevel && matchesSearch;
        });
    }, [selectedLevel, searchQuery, t]);

    const handleSelectVideo = (video: VideoTutorial) => {
        setSelectedVideo(video);
        navigate({ to: `/videos/${video.id}` });
    };

    if (selectedVideo) {
        return <VideoDetail video={selectedVideo} />;
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
                            size="sm"
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
                        onSelectVideo={handleSelectVideo}
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
