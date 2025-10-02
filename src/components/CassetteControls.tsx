import React from 'react';
import styles from './CassetteContols.module.css';

const CassetteControls: React.FC<{ onAdd: (denomination: number) => void; disabled: boolean }> = ({ onAdd, disabled }) => {
    const denominations = [100, 200, 500, 1000, 2000, 5000];
    return (
        <div className={styles.controls}>
            {denominations.map((den) => (
                <button
                    key={den}
                    disabled={disabled}
                    className={styles.addButton}
                    onClick={() => onAdd(den)}
                >
                    Добавить {den}
                </button>
            ))}
        </div>
    );
};

export default CassetteControls;
