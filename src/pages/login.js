import { useForm } from "react-hook-form";
import {useRouter} from "next/router";
import {useState} from "react";
import {useDispatch} from "react-redux";
import axios from "axios";
import NextLink from "next/link";
// local
import Layout from "../components/Layout";
import {loginUser} from "../utils/user/userSlice";
import auth from "../middlewares/auth";
// mui
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
// icons
import CloseIcon from '@mui/icons-material/Close';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Login = () => {
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)

    const router = useRouter()
    const dispatch = useDispatch()

    const { register, handleSubmit } = useForm();
    const onSubmit = data => axios
            .post('/api/user/login', data, { withCredentials: true })
            .then(({data}) => {
                if (data.message) {
                    setMessage(data.message)
                    setOpen(true)
                    return
                }
                dispatch(loginUser(data))
                router.push('/')
            })

    return (
        <Layout>
            <Box sx={{p:2, m: "auto", mt:8, maxWidth: 480}}>
                <Avatar sx={{m: 'auto', bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5" textAlign={'center'} sx={{my:2}}>
                    Войти
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2}>
                        <TextField
                            label="Имя пользователя"
                            {...register("username", { required: true })}/>
                        <TextField
                            label="Пароль"
                            type="password"
                            {...register("password", { required: true })}/>
                        <Button
                            type="submit"
                            variant="contained">
                            Войти
                        </Button>
                    </Stack>
                </form>
                <Typography textAlign="end" sx={{my:2}}>
                    <NextLink passHref={true} href={"/signup"}>
                        <Link variant="body2">
                            Зарегистрироваться
                        </Link>
                    </NextLink>
                </Typography>
            </Box>
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
                        <CloseIcon fontSize="small"/>
                    </IconButton>
                </Alert>
            </Snackbar>
        </Layout>
    )
}

export async function getServerSideProps({req, res}) {
    await auth.run(req, res);
    const user = req.user || false
    if (user) return {redirect: {destination: '/user/', permanent: false}}

    return { props: {} }
}

export default Login