import { GitHubPullRequest, GitHubRepo, GitHubUser } from './types';

const GITHUB_API_BASE = 'https://api.github.com';

export interface GitHubShowcaseData {
    user: GitHubUser;
    topRepos: GitHubRepo[];
    totalStars: number;
    topLanguages: string[];
    contributions: GitHubPullRequest[];
}

interface SearchIssuesItem {
    id: number;
    title: string;
    html_url: string;
    state: 'open' | 'closed';
    created_at: string;
    repository_url: string;
    pull_request?: { merged_at: string | null };
}

/**
 * Fetches pull requests authored by `username` across all of GitHub (via the
 * Search API) and filters down to ones opened against repositories the user
 * doesn't own — i.e. real open-source contributions rather than their own
 * project history.
 *
 * Best-effort: returns an empty list instead of throwing if the search API
 * is unavailable or rate-limited, so a hiccup here doesn't take down the
 * rest of the GitHub showcase section.
 */
async function fetchOpenSourceContributions(username: string): Promise<GitHubPullRequest[]> {
    try {
        const res = await fetch(
            `${GITHUB_API_BASE}/search/issues?q=author:${username}+type:pr&per_page=30&sort=created&order=desc`,
            { headers: { Accept: 'application/vnd.github+json' } }
        );

        if (!res.ok) return [];

        const data: { items: SearchIssuesItem[] } = await res.json();

        return data.items
            .map((item) => ({
                id: item.id,
                title: item.title,
                html_url: item.html_url,
                state: item.state,
                merged: Boolean(item.pull_request?.merged_at),
                createdAt: item.created_at,
                repoFullName: item.repository_url.replace(`${GITHUB_API_BASE}/repos/`, ''),
            }))
            .filter((pr) => pr.repoFullName.split('/')[0]?.toLowerCase() !== username.toLowerCase())
            .sort((a, b) => {
                if (a.merged !== b.merged) return a.merged ? -1 : 1;
                return a.createdAt < b.createdAt ? 1 : -1;
            });
    } catch {
        return [];
    }
}

/**
 * Fetches a GitHub user's public profile and repositories, and derives
 * the aggregate stats (total stars, top languages) used by the GitHub
 * showcase section.
 *
 * Uses the unauthenticated GitHub REST API, which is subject to a
 * 60 requests/hour/IP rate limit — acceptable for a low-traffic portfolio.
 */
export async function fetchGitHubShowcase(username: string): Promise<GitHubShowcaseData> {
    const [userRes, reposRes, contributions] = await Promise.all([
        fetch(`${GITHUB_API_BASE}/users/${username}`, {
            headers: { Accept: 'application/vnd.github+json' },
        }),
        fetch(`${GITHUB_API_BASE}/users/${username}/repos?per_page=100&sort=updated`, {
            headers: { Accept: 'application/vnd.github+json' },
        }),
        fetchOpenSourceContributions(username),
    ]);

    if (!userRes.ok || !reposRes.ok) {
        throw new Error('Unable to load GitHub data right now.');
    }

    const user: GitHubUser = await userRes.json();
    const repos: GitHubRepo[] = await reposRes.json();

    const ownedRepos = repos.filter((repo) => !repo.fork && !repo.archived);

    const totalStars = ownedRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    const languageCounts = new Map<string, number>();
    ownedRepos.forEach((repo) => {
        if (repo.language) {
            languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
        }
    });
    const topLanguages = [...languageCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([language]) => language);

    const topRepos = [...ownedRepos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count || (a.updated_at < b.updated_at ? 1 : -1))
        .slice(0, 6);

    return { user, topRepos, totalStars, topLanguages, contributions };
}
