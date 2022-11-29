import {useState} from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
import {useDispatch} from "react-redux";
// local
import nextAuth from "../../middlewares/nextAuth";
import {loginUser, updateUser} from "../../utils/user/userSlice";
import Layout from "../../components/Layout";
// mui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Backdrop from "@mui/material/Backdrop";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
// icons
import CloseIcon from "@mui/icons-material/Close";

const itemData = [
    {
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Breakfast',
    },
    {
        img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        title: 'Burger',
    },
    {
        img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
        title: 'Camera',
    },
    {
        img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
        title: 'Coffee',
    },
    {
        img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
        title: 'Hats',
    },
    {
        img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
        title: 'Honey',
    },
    {
        img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
        title: 'Basketball',
    },
    {
        img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
        title: 'Fern',
    },
    {
        img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
        title: 'Mushrooms',
    },
    {
        img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
        title: 'Tomato basil',
    },
    {
        img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
        title: 'Sea star',
    },
    {
        img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        title: 'Bike',
    },
];

const UserSetting = ({user}) => {
    const dispatch = useDispatch()
    if (user) dispatch(loginUser(user))

    const [src, setSrc] = useState(user.avatar)
    const [show, setShow] = useState(false)

    const [state, setState] = useState({
        open: false,
        message: '',
        status: 'info'
    })

    const {register, handleSubmit} = useForm();
    const onSubmit = data => {

        axios
            .post('/api/user/update', {
                avatar: src,
                username: data.username,
                email: data.email
            },{withCredentials: true})
            .then(({data}) => {
                if (data.message) setState({open: true, message: data.message, status: 'error'});
                else {
                    setState({
                        open: true,
                        message: 'Данные обновлены!',
                        status: 'success'
                    });
                    dispatch(updateUser(data))
                }
            })
    }

    const handleClick = () => {
        setShow(true)
    }


    return (
        <Layout>
            <Box sx={{p: 2, m: "auto", maxWidth: 480}}>
                <Stack spacing={2}>
                    <Avatar sx={{m: 'auto'}} src={src}></Avatar>
                    <Typography component="h1" variant="h5" textAlign={"center"}>
                        Профиль
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2}>
                            <Button variant="contained"
                                    component="label"
                                    onClick={handleClick}>
                                Изменить аватар
                            </Button>
                            <Backdrop
                                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                open={show}
                                onClick={() => setShow(false)}
                            >
                                <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                                    {itemData.map((item) => (
                                        <ImageListItem key={item.img} onClick={() => setSrc(item.img)}>
                                            <img
                                                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                                                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                alt={item.title}
                                                loading="lazy"
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </Backdrop>
                            <TextField
                                fullWidth
                                label="Имя пользователя"
                                defaultValue={user.username}
                                {...register("username", {required: true})}/>
                            <TextField
                                fullWidth
                                label="Электронная почта"
                                defaultValue={user.email}
                                {...register("email", {required: true})}/>
                            <Button
                                type="submit"
                                variant="outlined">
                                Обновить
                            </Button>
                        </Stack>
                    </form>
                </Stack>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={state.open}>
                    <Alert severity={state.status}>
                        {state.message}
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={() => setState({...state, open: false})}
                        >
                            <CloseIcon fontSize="small"/>
                        </IconButton>
                    </Alert>
                </Snackbar>
            </Box>
        </Layout>
    )
}

export async function getServerSideProps({req}) {
    const user = await nextAuth(req);
    if (!user) return {redirect : {destination: '/', permanent: false}};

    return {props: {user}};
}

export default UserSetting