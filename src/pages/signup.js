import axios from "axios";
import {useState} from "react";
import NextLink from "next/link";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import { useForm } from "react-hook-form";
// local
import auth from "../middlewares/auth";
import Layout from "../components/Layout";
import {loginUser} from "../utils/user/userSlice";
// mui
import Avatar from '@mui/material/Avatar';
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
import LoadingButton from "@mui/lab/LoadingButton";

const Signup = () => {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch()
    const router = useRouter()

    const { register, handleSubmit, formState: {errors} } = useForm();

    const onSubmit = data => {
        setLoading(true);
        axios
            .post('/api/user/signup', data, {withCredentials: true})
            .then(({data}) => {
                if (data.message) {
                    setMessage(data.message);
                    setOpen(true);
                    setLoading(false);
                    return
                }

                dispatch(loginUser(data.user))
                router.push('/')
            })
    }

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
                            error={"username" in errors}
                            helperText={errors.username?.message}
                            {...register("username", {
                                required: {
                                    value: true,
                                    message: "Обязательно укажите никнейм"
                                }
                            })}/>
                        <TextField
                            label="Электронная почта"
                            error={"email" in errors}
                            helperText={errors.email?.message}
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: "Обязательно укажите почту"
                                }
                            })}/>
                        <TextField
                            label="Пароль"
                            error={"password" in errors}
                            helperText={errors.password?.message}
                            type="password"
                            {...register("password", {
                                required: {
                                    value: true,
                                    message: "Обязательно укажите пароль"
                                }
                            })}/>
                        <LoadingButton
                            type={"submit"}
                            loading={loading}
                            loadingIndicator="Загрузка…"
                            variant="contained">
                            Зарегистрироваться
                        </LoadingButton>
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

export async function getServerSideProps({req, res}) {
    await auth.run(req, res);
    const user = req.user || false

    if (user) {
        return {redirect: {destination: '/user/', permanent: false}}
    }

    return { props: {} }
}

export default Signup