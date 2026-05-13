'use client';

import FAIcon from './FontAwesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
    const toggleTheme = () => {
        document.documentElement.classList.toggle('light-theme');
    };

    return (
        <button className={styles.toggle} onClick={toggleTheme} title="Toggle theme">
            <FAIcon icon={faMoon} className={styles.moonIcon} />
            <FAIcon icon={faSun} className={styles.sunIcon} />
        </button>
    );
}
