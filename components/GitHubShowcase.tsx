'use client';

import { useEffect, useState } from 'react';
import GlassCard from './GlassCard';
import { fetchGitHubShowcase, GitHubShowcaseData } from '@/lib/github';

interface GitHubShowcaseProps {
    username: string;
}

type LoadState = 'loading' | 'success' | 'error';

/**
 * GitHubShowcase renders a live snapshot of a GitHub profile: aggregate
 * stats (repos, stars, followers) and the top repositories by star count,
 * fetched client-side from the public GitHub REST API.
 *
 * Falls back to a simple "view profile" prompt if the API is unreachable
 * or rate-limited, so the section degrades gracefully instead of breaking
 * the page.
 */
export default function GitHubShowcase({ username }: GitHubShowcaseProps) {
    const [state, setState] = useState<LoadState>('loading');
    const [data, setData] = useState<GitHubShowcaseData | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetchGitHubShowcase(username)
            .then((result) => {
                if (!cancelled) {
                    setData(result);
                    setState('success');
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setState('error');
                }
            });

        return () => {
            cancelled = true;
        };
    }, [username]);

    if (state === 'loading') {
        return (
            <div
                className="flex items-center justify-center py-16"
                role="status"
                aria-label="Loading GitHub activity"
            >
                <span className="w-8 h-8 rounded-full border-2 border-purple-400/40 border-t-purple-400 animate-spin" />
            </div>
        );
    }

    if (state === 'error' || !data) {
        return (
            <GlassCard variant="default" className="text-center">
                <p className="text-gray-300 mb-4">
                    GitHub activity couldn&apos;t be loaded right now (the public API may be rate-limited).
                </p>
                <a
                    href={`https://github.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                    View GitHub Profile
                </a>
            </GlassCard>
        );
    }

    const { user, topRepos, totalStars, topLanguages } = data;

    const stats: { label: string; value: number | string }[] = [
        { label: 'Public Repos', value: user.public_repos },
        { label: 'Total Stars', value: totalStars },
        { label: 'Followers', value: user.followers },
        { label: 'Top Language', value: topLanguages[0] ?? '—' },
    ];

    return (
        <div>
            {/* Stat tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <GlassCard key={stat.label} variant="default" className="text-center">
                        <p className="text-2xl md:text-3xl font-bold text-gradient mb-1">{stat.value}</p>
                        <p className="text-xs md:text-sm text-gray-400">{stat.label}</p>
                    </GlassCard>
                ))}
            </div>

            {/* Top languages */}
            {topLanguages.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                    {topLanguages.map((language) => (
                        <span
                            key={language}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        >
                            {language}
                        </span>
                    ))}
                </div>
            )}

            {/* Top repositories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topRepos.map((repo) => (
                    <a
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full"
                        aria-label={`View ${repo.name} on GitHub`}
                    >
                        <GlassCard variant="hover" className="h-full flex flex-col">
                            <h3 className="text-lg font-semibold text-white mb-2 truncate">{repo.name}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                                {repo.description ?? 'No description provided.'}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/10">
                                <span>{repo.language ?? 'N/A'}</span>
                                <span className="flex items-center gap-3">
                                    <span aria-label={`${repo.stargazers_count} stars`}>★ {repo.stargazers_count}</span>
                                    <span aria-label={`${repo.forks_count} forks`}>⑂ {repo.forks_count}</span>
                                </span>
                            </div>
                        </GlassCard>
                    </a>
                ))}
            </div>

            <div className="text-center mt-8">
                <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 rounded-lg glass-card-hover text-white font-semibold"
                >
                    View Full GitHub Profile →
                </a>
            </div>
        </div>
    );
}
