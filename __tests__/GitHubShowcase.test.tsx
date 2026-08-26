import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GitHubShowcase from '@/components/GitHubShowcase';

const mockUser = {
    login: 'octocat',
    html_url: 'https://github.com/octocat',
    public_repos: 12,
    followers: 34,
    following: 5,
    avatar_url: 'https://avatars.githubusercontent.com/octocat',
};

const mockRepos = [
    {
        id: 1,
        name: 'querybot',
        html_url: 'https://github.com/octocat/querybot',
        description: 'A RAG chatbot',
        stargazers_count: 10,
        forks_count: 2,
        language: 'Python',
        updated_at: '2026-01-01T00:00:00Z',
        fork: false,
        archived: false,
    },
    {
        id: 2,
        name: 'old-fork',
        html_url: 'https://github.com/octocat/old-fork',
        description: 'A forked repo',
        stargazers_count: 100,
        forks_count: 0,
        language: 'JavaScript',
        updated_at: '2025-01-01T00:00:00Z',
        fork: true,
        archived: false,
    },
];

const mockSearchItems = [
    {
        id: 101,
        title: 'Fix flaky retry logic',
        html_url: 'https://github.com/someorg/somelib/pull/42',
        state: 'closed',
        created_at: '2026-02-01T00:00:00Z',
        repository_url: 'https://api.github.com/repos/someorg/somelib',
        pull_request: { merged_at: '2026-02-02T00:00:00Z' },
    },
    {
        id: 102,
        title: 'Add feature X',
        html_url: 'https://github.com/octocat/querybot/pull/7',
        state: 'open',
        created_at: '2026-03-01T00:00:00Z',
        // PR against the user's own repo — should be filtered out
        repository_url: 'https://api.github.com/repos/octocat/querybot',
        pull_request: { merged_at: null },
    },
];

function mockFetchSuccess() {
    global.fetch = jest.fn((url: string) => {
        if (url.includes('/search/issues')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ items: mockSearchItems }),
            } as Response);
        }
        if (url.endsWith('/repos?per_page=100&sort=updated')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockRepos),
            } as Response);
        }
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockUser),
        } as Response);
    }) as jest.Mock;
}

describe('GitHubShowcase', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('shows a loading indicator while fetching', () => {
        global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));
        render(<GitHubShowcase username="octocat" />);
        expect(screen.getByRole('status', { name: /loading github activity/i })).toBeInTheDocument();
    });

    it('renders live stats and excludes forked repos once loaded', async () => {
        mockFetchSuccess();
        render(<GitHubShowcase username="octocat" />);

        await waitFor(() => expect(screen.getByText('12')).toBeInTheDocument());

        // Forked repos are excluded from totals and the repo list
        expect(screen.queryByText('old-fork')).not.toBeInTheDocument();
        expect(screen.getByText('querybot')).toBeInTheDocument();
        expect(screen.getByText('34')).toBeInTheDocument(); // followers
        expect(screen.getByRole('link', { name: /view full github profile/i })).toHaveAttribute(
            'href',
            'https://github.com/octocat'
        );
    });

    it('shows external open-source contributions and excludes PRs against the user\'s own repos', async () => {
        mockFetchSuccess();
        render(<GitHubShowcase username="octocat" />);

        await waitFor(() => expect(screen.getByText('Fix flaky retry logic')).toBeInTheDocument());
        expect(screen.getByText('someorg/somelib')).toBeInTheDocument();
        expect(screen.getByText('Merged')).toBeInTheDocument();

        // PR opened against the user's own repo shouldn't show up in this list
        expect(screen.queryByText('Add feature X')).not.toBeInTheDocument();
    });

    it('falls back to a profile link when the API call fails', async () => {
        global.fetch = jest.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve({}) });
        render(<GitHubShowcase username="octocat" />);

        await waitFor(() =>
            expect(screen.getByText(/couldn't be loaded right now/i)).toBeInTheDocument()
        );
        expect(screen.getByRole('link', { name: /view github profile/i })).toHaveAttribute(
            'href',
            'https://github.com/octocat'
        );
    });
});
