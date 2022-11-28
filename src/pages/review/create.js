import {useDispatch} from "react-redux";
// local
import Layout from "../../components/Layout";
import nextAuth from "../../middlewares/nextAuth";
import {getCafe, getCafeArray} from "../../middlewares/dbReq";
import CafeCard from "../../components/Cafe/Card";
import {loginUser} from "../../utils/user/userSlice";
import ReviewRedactor from "../../components/Review/Redactor";
// mui
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const ReviewCreate = ({user, cafe, cafeArray}) => {
    const dispatch = useDispatch();
    if (user) dispatch(loginUser(user));

    if(!cafe) return (
        <Layout>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant={"h4"}>
                        Выберите кафе для отзыва
                    </Typography>
                </Grid>
                {cafeArray.map((el, index) => (
                    <Grid item xs={12} sm={8} md={4} key={index}>
                        <CafeCard cafe={el}/>
                    </Grid>
                ))}
            </Grid>
        </Layout>
    )

    return (
        <Layout>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <ReviewRedactor cafe={cafe}/>
                </Grid>
                <Grid item xs={4}>
                    <CafeCard cafe={cafe}/>
                </Grid>
            </Grid>
        </Layout>
    )
}

export async function getServerSideProps ({req, query}) {
    const user = await nextAuth(req)
    if (!user) return {redirect : {destination: '/', permanent: false}}

    const cafe = query.cafe ? await getCafe(query.cafe) : false
    const cafeArray = cafe ? [] : await getCafeArray();

    return { props: {user,  cafe, cafeArray} }
}

export default ReviewCreate