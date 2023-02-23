import nedb from 'nedb';
import { dbPaths } from './config';

const { cardsDB } = dbPaths;
export let DBs = {
    cardsDB: new nedb({ filename: cardsDB }),
};

// Avoid nedb init error
export async function loadDBs() {
    const promises = [];
    for (const db in DBs) {
        promises.push(
            new Promise<void>((r, reject) => {
                let times = 0;
                const load = () => {
                    // @ts-ignore
                    DBs[db].loadDatabase((err) => {
                        if (!err) {
                            r();
                            return;
                        }

                        if (times > 20) {
                            reject(
                                `Cannot load database ${db} after 10 times tries. (${err.toString()})`
                            );
                        }

                        setTimeout(load, 500);
                        times += 1;
                    });
                };

                load();
            })
        );
    }

    await Promise.race([
        Promise.all(promises),
        new Promise((_, r) => setTimeout(() => r(new Error('Timeout')), 20000)),
    ]);
}

export async function refreshDbs() {
    DBs = {
        cardsDB: new nedb({ filename: cardsDB }),
    };

    await loadDBs();
    return DBs;
}
