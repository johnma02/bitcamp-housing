import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Map from '@/components/map';
import { Inter } from 'next/font/google';
import Table from '@/components/table';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Bitcamp: Housing Map</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className={styles.header}>
                <div className={styles.banner}>
                    <h1 className={inter.className}>Bitcamp 2023: Housing Map</h1>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <Map></Map>
                    </div>

                    <div className={styles.card}>
                        <h2 className={inter.className}>Card 2</h2>
                        <Table></Table>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <p className={inter.className}>Bitcamp 2023: Bill Payers</p>
            </footer>
        </div>
    );
}
