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
import Input from "@mui/material/Input";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
// icons
import CloseIcon from "@mui/icons-material/Close";

const UserSetting = ({user}) => {
    const dispatch = useDispatch()
    if (user) dispatch(loginUser(user))

    const [src, setSrc] = useState(user.avatar)

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

    const previewImage = ({target}) => {
        if (target.files && target.files[0]) {

            const formData = new FormData()
            formData.append("image", target.files[0])

            axios
                .post(process.env.NEXT_PUBLIC_UPLOAD_LINK, formData, {headers: {'content-type': 'multipart/form-data'}})
                .then( ({data}) => setSrc(process.env.NEXT_PUBLIC_UPLOAD_LINK + data.file))
        }
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
                                    component="label">
                                Изменить аватар
                                <Input type={"file"}
                                       inputProps={{accept: "image/png, image/jpeg"}}
                                       sx={{display: "none"}}
                                       onInput={previewImage}
                                       {...register("avatar", {required: true})}/>
                            </Button>
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