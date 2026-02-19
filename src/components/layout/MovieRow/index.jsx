import React, { useRef } from 'react';
import MovieCard from '../../common/MovieCard';
import './styles.css';

const MovieRow = ({ title, movies = [], onCardClick, showBadge = false, icon = '' }) => {
    const rowRef = useRef(null);

    // Scroll the row left or right by one viewport width
    const scroll = (dir) => {
        if (!rowRef.current) return;
        const amount = rowRef.current.clientWidth * 0.75;
        rowRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
    };

    if (!movies.length) return null;

    return (
        <section className="movie-row" aria-label={title}>
            {/* ── Row header ── */}
            <div className="row-header">
                <h2 className="row-title">
                    {icon && <span className="row-icon">{icon}</span>}
                    {title}
                </h2>
                <div className="row-controls">
                    <button className="row-arrow" onClick={() => scroll('left')} aria-label="Scroll left">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <button className="row-arrow" onClick={() => scroll('right')} aria-label="Scroll right">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                    <span className="row-see-all">See All</span>
                </div>
            </div>

            {/* ── Scrollable track ── */}
            <div className="row-track" ref={rowRef}>
                {movies.map((movie, index) => (
                    <div className="row-card-wrap" key={movie.id}>
                        <MovieCard
                            movie={movie}
                            onClick={onCardClick}
                            animationDelay={`${index * 40}ms`}
                            showMatchBadge={showBadge}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MovieRow;
