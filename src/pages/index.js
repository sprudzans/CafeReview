import NextLink from "next/link";
import {useDispatch} from "react-redux";
// local
import auth from "../middlewares/auth";
import Layout from "../components/Layout";
import CafeCard from "../components/Cafe/Card";
import ReviewCard from "../components/Review/Card";
import {loginUser} from "../utils/user/userSlice";
import {getCafeArray, getReviewArray} from "../middlewares/dbReq";
// mui
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import axios from "axios";
import {useRouter} from "next/router";

const Home = ({user, cafeArray, reviewArray}) => {
    const dispatch = useDispatch();
    if (user) dispatch(loginUser(user));

    const router = useRouter()

    const handleInstall = () => axios
        .post('/api/install')
        .then(_ => router.reload())

    const ReviewList = () => (
        <Grid item xs={12} sm={10} md={4}>
            <Grid container spacing={2}>
                {reviewArray.map((el, index) => (
                    <Grid item key={index} xs={12}>
                        <ReviewCard item={el}/>
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Typography textAlign={"end"}>
                        <NextLink href="/review" passHref>
                            <Link underline="none" color={"secondary"}>Весь список отзывов</Link>
                        </NextLink>
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )

    const CafeList = () => (
        <Grid item xs={12} sm={10} md={8}>
            <Grid container spacing={2}>
                {cafeArray.map((cafe, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <CafeCard cafe={cafe}/>
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Typography textAlign={"end"}>
                        <NextLink href="/cafe" passHref>
                            <Link underline="none" color={"secondary"}>Весь список кафе</Link>
                        </NextLink>
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )

    if (!cafeArray.length && !reviewArray.length) return (
        <Layout>
            <Stack spacing={2} alignItems={'center'}>
                <Typography variant={"h4"} component={"h1"}>Кажется вы впервые запустили приложение</Typography>
                <Typography>Возможно вы захотите установить демо-данные</Typography>
                <Button onClick={handleInstall} color={"secondary"}>Установить</Button>
            </Stack>
        </Layout>
    )

    return (
        <Layout>
            <Grid container spacing={2} justifyContent={'center'}>
                <Grid item xs={12}>
                    <Typography variant={"h4"} component={"h1"}>Кафе и отзывы</Typography>
                </Grid>
                <ReviewList/>
                <CafeList/>
            </Grid>
        </Layout>
    )
}

export async function getServerSideProps({req, res}) {
    await auth.run(req, res);
    const user = req.user || false
    const cafeArray = await getCafeArray()
    const reviewArray = await getReviewArray()

    return { props: { user, cafeArray, reviewArray } }
}

export default Home
