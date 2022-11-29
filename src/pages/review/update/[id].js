import {useDispatch} from "react-redux";
// local
import {loginUser} from "../../../utils/user/userSlice";
import {getReview} from "../../../middlewares/dbReq";
import Layout from "../../../components/Layout";
import ReviewRedactor from "../../../components/Review/Redactor";
import auth from "../../../middlewares/auth";
import CafeCard from "../../../components/Cafe/Card";
// mui
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const ReviewUpdate = ({user, review}) => {
    const dispatch = useDispatch();
    if (user) dispatch(loginUser(user));

    return (

        <Layout>
            <Typography variant={"h4"}>Изменение отзыва</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <ReviewRedactor review={review}/>
                </Grid>
                <Grid item xs={12} sm={8} md={4}>
                    <CafeCard cafe={review.cafe}/>
                </Grid>
            </Grid>

        </Layout>
    )
}

export async function getServerSideProps({req, res, params}) {
    await auth.run(req, res);
    const user = req.user || false
    const review = await getReview(params.id)

    return {props: {user, review}}
}

export default ReviewUpdate