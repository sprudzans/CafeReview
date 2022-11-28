import axios from "axios";
import {useSelector} from "react-redux";
import Moment from "moment/moment";
import {useState} from "react";
import {useForm} from "react-hook-form";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// mui
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const CafeBook = ({cafe}) => {
    const moment = Moment().add(1, "h")
    const user = useSelector(state => state.user)
    const [open, setOpen] = useState(false)

    const {register, handleSubmit, formState: {errors}} = useForm();
    const onSubmit = data => {
        NProgress.start()
        axios.post('/api/booking/add', {cafe, ...data})
            .then(({data}) => {
                if (data.message) alert(data.message)
                else setOpen(true)
                NProgress.done()
            })
    }

    const handleClose = () => {
        setOpen(false)
    }

    const bookForm = (
        <form onSubmit={handleSubmit(onSubmit)}>
            <style>{`
                input::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    margin-left: -15px;
                }
            `}</style>
            <Stack spacing={2}>
                <Typography component="h1" variant="h5" textAlign={"center"}>
                    Забронировать столик
                </Typography>
                <TextField
                    fullWidth
                    error={'person' in errors}
                    helperText={errors.person?.message}
                    label="Персон"
                    defaultValue={2}
                    {...register("person", {
                        required: {
                            value: true,
                            message: "Обязательно указать количество персон"
                        },
                        max: {
                            value: 8,
                            message: "Не больше 8 гостей"
                        },
                        min: {
                            value: 1,
                            message: "Не меньше 1 гостя"
                        },
                        validate: value => Number(value) || 'Можно использовать только цифры'
                    })}
                />
                <TextField
                    label="Дата"
                    fullWidth
                    defaultValue={moment.format("YYYY-MM-DD")}
                    {...register("date", {required: true})}
                    type="date"/>
                <TextField
                    fullWidth
                    label="Время"
                    defaultValue={moment.format("HH:mm")}
                    {...register("time", {required: true})}
                    type="time"
                    inputProps={{
                        step: 60,
                    }}/>
                <TextField
                    fullWidth
                    label="Номер телефона"
                    defaultValue="79099099090"
                    {...register("phone", {required: true})}/>
                {!user.auth && <Typography textAlign={"center"} variant={"body2"}>Авторизуйтесь для бронирования</Typography>}
                <Button
                    type="submit"
                    variant="contained"
                    disabled={!user.auth}
                    sx={{bgcolor: 'secondary.dark'}}>
                    Забронировать
                </Button>
            </Stack>
        </form>
    )

    const successBook = (
        <Alert onClose={handleClose} severity="success" sx={{width: "100%"}}>
            Столик забронирован!
        </Alert>
    )

    return open ? successBook : bookForm
}


export default CafeBook