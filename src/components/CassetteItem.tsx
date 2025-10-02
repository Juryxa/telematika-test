import React from 'react';
import styles from './CassetteItem.module.css';

export interface Cassette {
    id: number;
    denomination: number;
    count: number;
    status: 'ok' | 'broken';
}

const CassetteItem: React.FC<{
    cassette: Cassette;
    onUpdate: (id: number, update: Partial<Cassette>) => void;
    onRemove: (id: number) => void;
}> = ({ cassette, onUpdate, onRemove }) => {
    return (
        <div className={styles.cassetteItem}>
            <span className={styles.denomination}>{cassette.denomination} ₽</span>
            <button
                className={cassette.status === 'ok' ? styles.statusOk : styles.statusBroken}
                onClick={() => onUpdate(cassette.id, { status: cassette.status === 'ok' ? 'broken' : 'ok' })}
            >
                {cassette.status === 'ok' ? 'Исправна' : 'Неисправна'}
            </button>
            <div className={styles.countControls}>
                <button className={styles.countButton} onClick={() => onUpdate(cassette.id, { count: Math.max(0, cassette.count - 1) })}>-</button>
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder={'кол-во купюр'}
                    pattern="[0-9]*"
                    className={styles.countInput}
                    value={cassette.count === 0 ? '0' : cassette.count}
                    onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        val = val.replace(/^0+/, '');
                        onUpdate(cassette.id, { count: val === '' ? 0 : Number(val) });
                    }}
                />


                <button className={styles.countButton} onClick={() => onUpdate(cassette.id, { count: cassette.count + 1 })}>+</button>
            </div>
            <button className={styles.removeButton} onClick={() => onRemove(cassette.id)}>Удалить</button>
        </div>
    );
};

export default CassetteItem;
