/**
 * Play.jsx  ─ Dedicated Player Page "/play/:id"
 * ═══════════════════════════════════════════════════════════════
 * Full-screen player with header and breadcrumb navigation.
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import Header from '@/components/layout/Header';
import { MOOD_MOVIES } from '@/data/moodData';
import { TMDB_API_KEY, STREAM_PROVIDERS } from '@/config/constants';
import '@/components/common/Loading/styles.css';
import './styles.css';

const Play = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    /* ── State ── */
    const [movieTitle, setMovieTitle] = useState('Loading...');
    const [providerIdx, setProviderIdx] = useState(0);
    const [playerReady, setPlayerReady] = useState(false);
    const [playerError, setPlayerError] = useState(false);
    const [showSlowWarning, setShowSlowWarning] = useState(false);
    const slowTimer = useRef(null);

    const provider = STREAM_PROVIDERS[providerIdx];
    const embedUrl = provider.url(id);

    /* ── Fetch movie title ── */
    useEffect(() => {
        setPlayerReady(false);
        setPlayerError(false);

        const local = MOOD_MOVIES.find(m => m.id === Number(id));
        if (local) { setMovieTitle(local.title); return; }

        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`)
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data?.title) setMovieTitle(data.title); })
            .catch(() => { });
    }, [id]);

    /* ── Player lifecycle ── */
    useEffect(() => {
        setPlayerReady(false);
        setPlayerError(false);
        setShowSlowWarning(false);
        clearTimeout(slowTimer.current);
        slowTimer.current = setTimeout(() => setShowSlowWarning(true), 10000);
        return () => clearTimeout(slowTimer.current);
    }, [id, providerIdx]);

    const handleLoad = () => {
        setPlayerReady(true);
        setShowSlowWarning(false);
        clearTimeout(slowTimer.current);
    };

    const switchProvider = () => setProviderIdx(i => (i + 1) % STREAM_PROVIDERS.length);

    return (
        <div className="page-wrapper">
            <Header />

            {/* ── Breadcrumb + Provider bar ── */}
            <div className="play-topbar">
                <nav className="play-breadcrumb" aria-label="Breadcrumb">
                    <Link to="/" className="play-breadcrumb__link">Home</Link>
                    <span className="play-breadcrumb__sep">&gt;</span>
                    <Link to={`/watch/${id}`} className="play-breadcrumb__link">Movies</Link>
                    <span className="play-breadcrumb__sep">&gt;</span>
                    <span className="play-breadcrumb__current">{movieTitle}</span>
                </nav>

                <div className="play-provider-pills">
                    {STREAM_PROVIDERS.map((p, i) => (
                        <button
                            key={p.key}
                            className={`play-provider-pill ${i === providerIdx ? 'active' : ''}`}
                            onClick={() => setProviderIdx(i)}
                            title={`Stream via ${p.label}`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Player ── */}
            <section className="play-player-section" aria-label="Movie Player">
                <div className="play-player-wrap">
                    {/* Loading shimmer */}
                    {!playerReady && !playerError && (
                        <div className="play-player-shimmer">
                            <div className="loading-center">
                                <div className="spinner" />
                                <p style={{ color: 'var(--c-muted)', fontSize: '0.85rem', marginTop: 8 }}>
                                    Connecting via <strong style={{ color: 'var(--c-text)' }}>{provider.label}</strong>...
                                </p>
                                {showSlowWarning && (
                                    <div className="play-slow-warning">
                                        <p>Taking too long? Try a different source.</p>
                                        <button className="play-switch-btn" onClick={switchProvider}>
                                            Switch to {STREAM_PROVIDERS[(providerIdx + 1) % STREAM_PROVIDERS.length].label}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error fallback */}
                    {playerError && (
                        <div className="play-player-error">
                            <p style={{ color: 'var(--c-text)', fontWeight: 700, fontSize: '1.1rem' }}>Stream failed to load</p>
                            <p style={{ color: 'var(--c-muted)', fontSize: '0.85rem', textAlign: 'center', maxWidth: 360 }}>
                                {provider.label} couldn't serve this title right now.
                            </p>
                            <button className="play-switch-btn" onClick={switchProvider}>
                                Try {STREAM_PROVIDERS[(providerIdx + 1) % STREAM_PROVIDERS.length].label} instead
                            </button>
                        </div>
                    )}

                    <iframe
                        key={embedUrl}
                        src={embedUrl}
                        title={`Watch ${movieTitle}`}
                        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; web-share"
                        referrerPolicy="no-referrer-when-downgrade"
                        scrolling="no"
                        onLoad={handleLoad}
                        onError={() => { setPlayerError(true); setPlayerReady(true); }}
                        className={`play-iframe ${playerReady ? 'play-iframe--ready' : ''}`}
                    />
                </div>
            </section>
        </div>
    );
};

export default Play;
