import NextLink from "next/link";
import {useDispatch} from "react-redux";
// local
import auth from "../../middlewares/auth";
import {getCafeArray, getReviewArray} from "../../middlewares/dbReq";
import {loginUser} from "../../utils/user/userSlice";
import CafeCard from "../../components/Cafe/Card";
import Layout from "../../components/Layout";
import ReviewCard from "../../components/Review/Card";
// mui
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";

const UserMain = ({user, cafeArray, reviewArray}) => {
    const dispatch = useDispatch()
    if (user) dispatch(loginUser(user))

    const UserInfo = () => (
        <Box>
            <Typography variant={"h5"}>Данные вашего профиля</Typography>
            <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar alt={user.username} src={user.avatar}/>
                    </ListItemAvatar>
                    <ListItemText primary={user.username} secondary={user.email}/>
                </ListItem>
            </List>
            <Typography textAlign={"end"}>
                <NextLink href="/user/setting" passHref>
                    <Button variant={"contained"} color={"secondary"}>Изменить профиль</Button>
                </NextLink>
            </Typography>
        </Box>
    )

    const UserReview = () => (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant={"h6"}>Ваши отзывы</Typography>
                </Grid>
                {reviewArray.length
                    ? reviewArray.map((el, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <ReviewCard item={el}/>
                        </Grid>
                    )) : (
                        <Grid item xs={4}>
                            <Typography>Список пуст</Typography>
                        </Grid>
                    )}
            </Grid>
        </Box>
    )

    const UserCafe = () => (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant={"h6"}>Ваши кафе</Typography>
                </Grid>
                {cafeArray.length
                    ? cafeArray.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item._id}>
                            <CafeCard cafe={item}/>
                        </Grid>
                    )) : (
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography>Список пуст</Typography>
                        </Grid>
                    )}
                <Grid item xs={12}>
                    <Typography textAlign={"end"}>
                        <NextLink href={'/cafe/create'} passHref>
                            <Button variant={"contained"} color={"secondary"}>Добавить кафе</Button>
                        </NextLink>
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )

    return (
        <Layout>
            <Stack spacing={2} divider={<Divider/>}>
                <UserInfo/>
                <UserReview/>
                <UserCafe/>
            </Stack>
        </Layout>
    )
}

export async function getServerSideProps({req, res}) {
    await auth.run(req, res);
    const user = req.user || false

    if (!user) return {redirect: {destination: '/', permanent: false}};

    const cafeArray = await getCafeArray({user: user.id})
    const reviewArray = await getReviewArray({user: user.id})

    return {props: {user, cafeArray, reviewArray}}
}

export default UserMain