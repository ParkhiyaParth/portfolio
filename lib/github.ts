import { GitHubRepo, GitHubUser } from './types';

const GITHUB_API_BASE = 'https://api.github.com';

export interface GitHubShowcaseData {
    user: GitHubUser;
    topRepos: GitHubRepo[];
    totalStars: number;
    topLanguages: string[];
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
    const [userRes, reposRes] = await Promise.all([
        fetch(`${GITHUB_API_BASE}/users/${username}`, {
            headers: { Accept: 'application/vnd.github+json' },
        }),
        fetch(`${GITHUB_API_BASE}/users/${username}/repos?per_page=100&sort=updated`, {
            headers: { Accept: 'application/vnd.github+json' },
        }),
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

    return { user, topRepos, totalStars, topLanguages };
}
