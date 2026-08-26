import { metadata } from '@/app/layout';

describe('Site metadata', () => {
    test('has a descriptive title and description', () => {
        expect(metadata.title).toMatch(/Parth Parkhiya/);
        expect(metadata.description).toBeTruthy();
        expect(String(metadata.description).length).toBeGreaterThan(20);
    });

    test('sets a metadataBase for resolving OG/icon image URLs', () => {
        expect(metadata.metadataBase).toBeInstanceOf(URL);
    });

    test('configures OpenGraph fields for link previews', () => {
        expect(metadata.openGraph?.title).toBeTruthy();
        expect(metadata.openGraph?.description).toBeTruthy();
        expect(metadata.openGraph?.type).toBe('website');
    });

    test('configures a large-image Twitter card', () => {
        expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' });
    });
});
