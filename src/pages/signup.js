import axios from "axios";
import {useState} from "react";
import NextLink from "next/link";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import { useForm } from "react-hook-form";
// local
import nextAuth from "../middlewares/nextAuth";
import Layout from "../components/Layout";
import {loginUser} from "../utils/user/userSlice";
// mui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
// icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CloseIcon from "@mui/icons-material/Close";

const Signup = () => {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()
    const router = useRouter()

    const { register, handleSubmit } = useForm();

    const onSubmit = data => axios
        .post('/api/user/signup', data, { withCredentials: true })
        .then(({data}) => {
            if (data.message) {
                setMessage(data.message)
                setOpen(true)
                return
            }

            dispatch(loginUser(data.user))
            router.push('/')
        })

    return (
        <Layout>
            <Box sx={{p:2, m: "auto", mt:8, maxWidth: 480}}>
                <Avatar sx={{ m: 'auto', bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" align="center" sx={{my:2}}>
                    Регистрация
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2}>
                        <TextField
                            label="Имя пользователя"
                            {...register("username", { required: true })}/>
                        <TextField
                            label="Электронная почта"
                            {...register("email", { required: true })}/>
                        <TextField
                            label="Пароль"
                            type="password"
                            {...register("password", { required: true })}/>
                        <Button
                            type="submit"
                            variant="contained">
                            Зарегистрироваться
                        </Button>
                    </Stack>
                </form>
                <Typography textAlign="end" sx={{my:2}}>
                    <NextLink passHref={true} href={"/login"}>
                        <Link variant="body2">
                            Авторизоваться
                        </Link>
                    </NextLink>
                </Typography>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center', }}
                    open={open}>
                    <Alert severity="warning">
                        {message}
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={() => setOpen(false)}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Alert>
                </Snackbar>
            </Box>
        </Layout>
    )
}

export async function getServerSideProps({req}) {
    const user = await nextAuth(req)

    if (user) {
        return {redirect: {destination: '/user/', permanent: false}}
    }

    return { props: {} }
}

export default Signup