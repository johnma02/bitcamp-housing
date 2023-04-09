import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Map from '@/components/map';
import { Inter } from 'next/font/google';


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
                <Map></Map>
            </main>

            <footer className={styles.footer}>
                <p className={inter.className}>Bitcamp 2023: Bill Payers</p>
            </footer>
        </div>
    );
}
