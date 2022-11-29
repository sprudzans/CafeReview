import axios from "axios";
import {useDispatch} from "react-redux";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import {useState} from "react";
// local
import auth from "../../middlewares/auth";
import {getCafe} from "../../middlewares/dbReq";
import {loginUser, updateUser} from "../../utils/user/userSlice";
import Layout from "../../components/Layout";
import CafeBook from "../../components/Cafe/Book";
import CafeReview from "../../components/Cafe/Review";
import CafeComment from "../../components/Cafe/Comment";
// mui
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import LinearProgress from "@mui/material/LinearProgress";
// icons
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Editor = dynamic(
    () => import("../../components/Editor"),
    {ssr: false}
)

const CafeAbout = ({user, cafe}) => {
    const dispatch = useDispatch();
    if (user) dispatch(loginUser(user))

    const [isLiked, setIsLiked] = useState(user.favorite ? user.favorite.includes(cafe._id) : false)

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = () => {
        const favoriteArray = isLiked
            ? user.favorite.filter(el => el !== cafe._id)
            : [...user.favorite, cafe._id]

        axios
            .post('/api/user/update', {favorite: favoriteArray}, {withCredentials: true})
            .then(({data}) => dispatch(updateUser(data)))

        setIsLiked(!isLiked)
    }

    return (
        <Layout title={cafe.title}>
            <Grid container justifyContent={"center"} spacing={2}>
                <Grid item sm={12} md={8}>
                    <Grid container justifyContent={"space-between"} spacing={2}>
                        <Grid item xs={8}>
                            <Typography variant={"h4"} component={"p"}>
                                {cafe.title}
                            </Typography>
                        </Grid>
                        <Grid item>
                            {user.id === cafe.user && (
                                <NextLink href={'/cafe/update/' + cafe._id} passHref>
                                    <IconButton>
                                        <DriveFileRenameOutlineIcon/>
                                    </IconButton>
                                </NextLink>
                            )}
                            {user && (
                                <IconButton onClick={handleClick}>
                                    {isLiked ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                                </IconButton>
                            )}
                        </Grid>


                        <Grid item xs={12}></Grid>
                        <Grid item>
                            <Typography>
                                <Rating name="read-only" value={cafe.rating} size="small" readOnly precision={0.5}/>
                            </Typography>
                        </Grid>
                        <Grid item textAlign="end">
                            <Typography>
                                {`${'₽'.repeat(cafe.cost > 4000 ? 4 : Math.ceil(cafe.cost / 500))}`} / средний чек {cafe.cost} руб
                            </Typography>
                        </Grid>
                        <Grid item xs={12}></Grid>
                        <Grid item>
                            <Editor defaultValue={JSON.parse(cafe.desc)} readOnly={true}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Stack spacing={2}>
                        <Box sx={{maxWidth: "100%", height: 220, position: "relative"}}>
                            <img width={"100%"} src={cafe.image} alt={cafe.title}/>
                        </Box>
                        <CafeBook cafe={cafe._id}/>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <CafeReview cafeID={cafe._id} reviewArray={cafe.reviews}/>
                </Grid>
                <Grid item xs={12}>
                    <CafeComment cafeID={cafe._id} commentArray={cafe.comments}/>
                </Grid>
            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <Box>
                    <Alert severity="info">
                        <AlertTitle>Удалено!</AlertTitle>
                        Вы будете переведены на главную страницу
                    </Alert>
                    <LinearProgress/>
                </Box>
            </Backdrop>
        </Layout>
    )
}

export async function getServerSideProps({req, res, params}) {
    await auth.run(req, res);
    const user = req.user || false
    const cafe = await getCafe(params.id)

    if (!cafe) return {redirect: {destination: '/404', permanent: false}}
    else return { props: {user,  cafe} }
}

export default CafeAbout