import NextLink from "next/link";
import {useSelector} from "react-redux";
// local
import ReviewCard from "../Review/Card";
// mui
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";

const CafeReview = ({cafeID, reviewArray}) => {
    const user = useSelector(state => state.user)

    const CafeReviewList = () => {
        if (!reviewArray || !reviewArray.length) return (
            <Grid container>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{p:2}}>Здесь пока нет отзывов</Paper>
                </Grid>
            </Grid>
        );

        return (
            <Grid container spacing={2}>
                {reviewArray.map((el, index) => (
                    <Grid key={index} item xs={12} sm={6} md={4}>
                        <ReviewCard item={el}/>
                    </Grid>
                ))}
            </Grid>
        )
    }


    return (
        <>
            <Typography sx={{mb:2}}>Отзывы</Typography>
            <CafeReviewList/>
            {user.auth && (<Typography textAlign={"end"} sx={{my: 2}}>
                <NextLink href={'/review/create/?cafe=' + cafeID} passHref>
                    <Link underline="none" color={"secondary"}>Добавить отзыв</Link>
                </NextLink>
            </Typography>)}
        </>
    )
}

export default CafeReview