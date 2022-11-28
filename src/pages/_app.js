import PropTypes from 'prop-types';
import Head from 'next/head';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {CacheProvider} from '@emotion/react';
import {useEffect} from 'react'
import {useRouter} from 'next/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {Provider} from 'react-redux'
// local
import '../styles/styles.css'
import theme from '../utils/theme';
import store from '../utils/store'
import createEmotionCache from '../utils/createEmotionCache';

const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
    const router = useRouter();

    useEffect(() => {
        const handleStart = () => {
            NProgress.start()
        }

        const handleStop = () => {
            NProgress.done()
        }

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleStop)
    }, [router])

    const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;

    return (
        <Provider store={store}>
            <CacheProvider value={emotionCache}>
                <Head>
                    <meta name="viewport" content="initial-scale=1, width=device-width"/>
                </Head>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <Component {...pageProps} />
                </ThemeProvider>
            </CacheProvider>
        </Provider>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    emotionCache: PropTypes.object,
    pageProps: PropTypes.object.isRequired,
};