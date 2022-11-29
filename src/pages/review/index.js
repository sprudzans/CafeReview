import {useDispatch} from "react-redux";
// local
import Layout from "../../components/Layout";
import {loginUser} from "../../utils/user/userSlice";
import {getReviewArray} from "../../middlewares/dbReq";
import ReviewCard from "../../components/Review/Card";
import auth from "../../middlewares/auth";
// mui
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const Review = ({user, reviewArray}) => {
    const dispatch = useDispatch();
    if (user) dispatch(loginUser(user));

    return (
        <Layout>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography>Все отзывы</Typography>
                </Grid>
                {reviewArray.map((el, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                        <ReviewCard item={el}/>
                    </Grid>
                ))}
            </Grid>
        </Layout>
    )
}

export async function getServerSideProps({req, res}) {
    await auth.run(req, res);
    const user = req.user || false

    const reviewArray = await getReviewArray()

    return { props: { user, reviewArray } }
}

export default Review