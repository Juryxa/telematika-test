import React, {useState} from 'react';
import styles from './Withdrawal.module.css';
import CassetteItem, {Cassette} from '../components/CassetteItem';
import CassetteControls from '../components/CassetteControls';

function withdraw(amount: number, cassettes: Cassette[]) {
    const start = performance.now();
    const sorted = [...cassettes]
        .filter(c => c.status === 'ok' && c.count > 0)
        .sort((a, b) => b.denomination - a.denomination);

    let remaining = amount;
    const result: { [id: number]: number } = {};

    for (let c of sorted) {
        let need = Math.floor(remaining / c.denomination);
        let take = Math.min(need, c.count);
        if (take > 0) {
            result[c.id] = take;
            remaining -= take * c.denomination;
        }
    }

    const success = remaining === 0;
    const end = performance.now();
    const time = (end - start) / 1000;

    return { success, result, time };
}

const Withdrawal: React.FC = () => {
    const [cassettes, setCassettes] = useState<Cassette[]>([]);
    const [amount, setAmount] = useState<number | ''>('');
    const [output, setOutput] = useState<string>('');

    const addCassette = (denomination: number) => {
        if (cassettes.length >= 8) return;
        setCassettes([...cassettes, { id: Date.now() + Math.random(), denomination, count: 0, status: 'ok' }]);
    };

    const updateCassette = (id: number, update: Partial<Cassette>) => {
        setCassettes(cassettes.map(c => (c.id === id ? { ...c, ...update } : c)));
    };

    const removeCassette = (id: number) => {
        setCassettes(cassettes.filter(c => c.id !== id));
    };

    const handleWithdraw = () => {
        if (!amount || amount <= 0) return;

        const { success, result, time } = withdraw(Number(amount), cassettes);
        if (!success) {
            setOutput(`Невозможно выдать сумму ${amount} ₽. Время: ${time} с`);
        } else {
            // уменьшаем количество купюр
            setCassettes(prev =>
                prev.map(c =>
                    result[c.id]
                        ? { ...c, count: c.count - result[c.id] }
                        : c
                )
            );

            const grouped: { [den: number]: number } = {};
            for (let [id, cnt] of Object.entries(result)) {
                const c = cassettes.find(cs => cs.id === Number(id));
                if (c) {
                    grouped[c.denomination] = (grouped[c.denomination] || 0) + cnt;
                }
            }
            const summary = Object.entries(grouped)
                .map(([den, cnt]) => `${cnt} купюр по ${den}₽`)
                .join('\n');

            setOutput(`Выдать можно:\n ${summary}.\n Время: ${time} с`);
        }
    };

    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Настройка кассет</h1>

            <div className={styles.cassettes}>
                <CassetteControls onAdd={addCassette} disabled={cassettes.length >= 8} />
                {cassettes.map((c) => (
                    <CassetteItem key={c.id} cassette={c} onUpdate={updateCassette} onRemove={removeCassette} />
                ))}
            </div>

            <div className={styles.withdrawControls}>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className={styles.amountInput}
                    placeholder="Сумма в ₽"
                    value={amount === 0 ? '' : amount}
                    onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        val = val.replace(/^0+/, '');
                        setAmount(val === '' ? 0 : Number(val));
                    }}
                />

                <button className={styles.withdrawButton} onClick={handleWithdraw}>
                    Снять наличные
                </button>
            </div>

            <div className={styles.outputWrapper}>
                {output && <p className={styles.output}>{output}</p>}
            </div>
        </main>
    );
};

export default Withdrawal;
