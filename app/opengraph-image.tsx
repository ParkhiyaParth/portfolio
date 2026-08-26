import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0a0a0a',
                    backgroundImage:
                        'radial-gradient(circle at 25% 25%, rgba(168, 85, 247, 0.35), transparent 50%), radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.35), transparent 50%)',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        width: 140,
                        height: 140,
                        borderRadius: 28,
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
                        color: '#ffffff',
                        fontSize: 64,
                        fontWeight: 700,
                        marginBottom: 36,
                    }}
                >
                    PP
                </div>
                <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, color: '#f5f5f5' }}>
                    Parth Parkhiya
                </div>
                <div style={{ display: 'flex', fontSize: 32, color: '#a1a1aa', marginTop: 16 }}>
                    AI/ML Engineer &amp; LLM/RAG Developer
                </div>
            </div>
        ),
        { ...size }
    );
}
