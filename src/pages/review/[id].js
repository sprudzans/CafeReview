import NextLink from "next/link";
import dynamic from "next/dynamic";
import {useDispatch} from "react-redux";
import {useState} from "react";
// local
import Layout from "../../components/Layout";
import {loginUser} from "../../utils/user/userSlice";
import {getReview} from "../../middlewares/dbReq";
import auth from "../../middlewares/auth";
import CafeCard from "../../components/Cafe/Card";
// mui
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Backdrop from "@mui/material/Backdrop";
import IconButton from "@mui/material/IconButton";
// icons
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

const Editor = dynamic(
    () => import("../../components/Editor"),
    {ssr: false}
)

const ReviewDetail = ({user, review}) => {
    const dispatch = useDispatch();
    if (user) dispatch(loginUser(user));

    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);


    return (
        <Layout title={review.title}>
            <Grid container justifyContent={"center"} spacing={2}>
                <Grid item xs={12} md={8}>
                    <Grid container justifyContent={"space-between"}>
                        <Grid item xs={8}>
                            <Typography variant={"h4"}>
                                {review.title}
                            </Typography>
                        </Grid>
                        {user.id === review.user && (
                            <Grid item>
                                <NextLink href={'/review/update/' + review._id} passHref>
                                    <IconButton>
                                        <DriveFileRenameOutlineIcon/>
                                    </IconButton>
                                </NextLink>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Box>
                                <Editor defaultValue={JSON.parse(review.desc)} readOnly={true}/>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <CafeCard cafe={review.cafe}/>
                </Grid>
            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}>
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
    const review = await getReview(params.id)

    if (!review) return {redirect: {destination: '/404', permanent: false}}
    else return { props: { user, review } }
}

export default ReviewDetail