import React from 'react';
import { ExternalLinkIcon } from '@radix-ui/react-icons';

interface TechniqueVideoProps {
    youtubeId: string;
    title: string;
    creator: string;
    creatorChannel: string;
    description: string;
    duration: number;
    licenseType: string;
}

export const TechniqueVideo: React.FC<TechniqueVideoProps> = ({
    youtubeId,
    title,
    creator,
    creatorChannel,
    description,
    duration,
    licenseType,
}) => {
    // Use youtube-nocookie.com for privacy protection
    const src = `https://www.youtube-nocookie.com/embed/${youtubeId}`;

    return (
        <div className="space-y-4">
            {/* Video Container with 16:9 aspect ratio */}
            <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                <iframe
                    className="absolute inset-0 w-full h-full"
                    src={src}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                />
            </div>

            {/* Video Information */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {description}
                    </p>
                </div>

                {/* Creator Attribution */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-1">
                                Video by
                            </p>
                            <a
                                href={creatorChannel}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
                            >
                                {creator}
                                <ExternalLinkIcon className="w-3 h-3" />
                            </a>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                                Duration
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {duration} min
                            </p>
                        </div>
                    </div>
                </div>

                {/* License Information */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                        <span className="font-semibold">License:</span> {licenseType}
                        {' • '}
                        Embedded from YouTube with proper attribution
                    </p>
                </div>
            </div>
        </div>
    );
};
