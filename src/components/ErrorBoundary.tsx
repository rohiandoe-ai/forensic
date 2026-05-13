'use client';

import { Component, ReactNode } from 'react';
import FAIcon from './FontAwesome';
import { faExclamationTriangle, faRedo } from '@fortawesome/free-solid-svg-icons';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 20px',
                    textAlign: 'center',
                    minHeight: '300px',
                }}>
                    <div style={{
                        width: '70px', height: '70px',
                        background: 'rgba(255, 82, 82, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        border: '1px solid rgba(255, 82, 82, 0.2)',
                    }}>
                        <FAIcon icon={faExclamationTriangle} style={{ fontSize: '1.8rem', color: '#ff5252' }} />
                    </div>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '10px', fontFamily: 'var(--font-heading)' }}>
                        Something went wrong
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '20px' }}>
                        An unexpected error occurred. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: undefined })}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 22px',
                            background: 'linear-gradient(135deg, var(--primary-blue), var(--secondary-blue))',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontFamily: 'var(--font-heading)',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                        }}
                    >
                        <FAIcon icon={faRedo} /> Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
